import { Model } from "mongoose";
import { TMeta, TQueryObject } from "../types/query.interface.js";

const RESERVED_QUERY_KEYS = new Set([
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "fields",
]);

interface IQueryBuilderResult<T> {
  data: T[];
  meta: TMeta;
}

/**
 * Generic query builder for list endpoints — the Mongoose adaptation of
 * the reference architecture's QueryBuilder. Keeps the same fluent chain:
 *
 *   new QueryBuilder(Model, req.query)
 *     .search(searchableFields)
 *     .filter(filterableFields)
 *     .paginate()
 *     .sort()
 *     .fields()
 *     .execute()
 *
 * - search(): case-insensitive $regex across whitelisted fields ($or)
 * - filter(): copies only whitelisted query keys into the filter; nested
 *   objects coming from the extended query parser (e.g. ?experience[gte]=2)
 *   are converted into MongoDB operators ($gte) and "true"/"false"
 *   strings are coerced to booleans.
 */
export class QueryBuilder<T extends object> {
  private filters: Record<string, unknown> = {};
  private projection: Record<string, number> | null = null;
  private page = 1;
  private limit = 10;
  private skip = 0;
  private sortOrder = "-createdAt";

  constructor(
    private readonly model: Model<T>,
    private readonly query: TQueryObject
  ) {}

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm;

    if (typeof searchTerm === "string" && searchTerm.trim().length > 0) {
      const regex = { $regex: searchTerm.trim(), $options: "i" };

      this.filters.$or = searchableFields.map((field) => ({
        [field]: regex,
      }));
    }

    return this;
  }

  filter(filterableFields: string[]): this {
    for (const [key, rawValue] of Object.entries(this.query)) {
      if (RESERVED_QUERY_KEYS.has(key)) continue;
      if (!filterableFields.includes(key)) continue;

      this.filters[key] = this.normalizeFilterValue(rawValue);
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page);
    const limit = Number(this.query.limit);

    if (Number.isInteger(page) && page > 0) {
      this.page = page;
    }

    if (Number.isInteger(limit) && limit > 0) {
      this.limit = Math.min(limit, 100);
    }

    this.skip = (this.page - 1) * this.limit;

    return this;
  }

  sort(): this {
    const sortBy = this.query.sortBy;

    // Supports "-createdAt", "title,-createdAt", "title" ...
    if (typeof sortBy === "string" && sortBy.trim().length > 0) {
      this.sortOrder = sortBy.trim();
    }

    return this;
  }

  fields(): this {
    const fieldsParam = this.query.fields;

    if (typeof fieldsParam === "string" && fieldsParam.trim().length > 0) {
      this.projection = fieldsParam
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean)
        .reduce<Record<string, number>>((projection, field) => {
          projection[field.replace(/^-/, "")] = field.startsWith("-") ? 0 : 1;
          return projection;
        }, {});
    }

    return this;
  }

  async execute(): Promise<IQueryBuilderResult<T>> {
    // Filters/projection are assembled dynamically from whitelisted query
    // keys; Mongoose casts them against the schema at runtime.
    const filter = this.filters as never;
    const projection = (this.projection ?? undefined) as never;

    const [data, total] = await Promise.all([
      this.model
        .find(filter, projection)
        .sort(this.sortOrder)
        .skip(this.skip)
        .limit(this.limit),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages: Math.max(Math.ceil(total / this.limit), 1),
      },
    };
  }

  private normalizeFilterValue(value: unknown): unknown {
    if (typeof value === "string") {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    }

    // Nested objects arrive from operators like ?technologies[in]=a,b
    // or range filters like ?experience[gte]=2 via the extended parser.
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const operatorObject: Record<string, unknown> = {};

      for (const [operatorKey, operatorValue] of Object.entries(value)) {
        const normalized = this.normalizeFilterValue(operatorValue);

        if (operatorKey === "in" && typeof normalized === "string") {
          operatorObject.$in = normalized.split(",").map((item) => item.trim());
          continue;
        }

        operatorObject[`$${operatorKey}`] = normalized;
      }

      return operatorObject;
    }

    return value;
  }
}
