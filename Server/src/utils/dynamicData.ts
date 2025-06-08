import { prismaClient } from "../prisma";
import { ExtendedRequest } from "../types/users/usersRequests";
import { Response } from "express";
type GetDynamicDataOptions = {
  model: string;
  searchFields?: { path: string; field: string }[];
  includeCounts?: { [key: string]: boolean };
  include?: { [key: string]: boolean | object };
  excludeOrganizationId?: boolean;
  defaultSortField?: string;
  whereClause?: { [key: string]: any };
  transformResponse?: (data: any) => any;
  filters?: string[];
  departmentWhereClause?: (departmentIds: number[]) => object;
};

export const getDynamicData = async (
  req: ExtendedRequest,
  res: Response,
  options: GetDynamicDataOptions
): Promise<any> => {
  try {
    const {
      organizationId,
      page,
      pageSize,
      search,
      sortField,
      sortDirection,
      ...restQuery
    } = req.query;
    const finalFilters = { ...restQuery, ...req.params };
    const organizationIdNumber = Number(organizationId);

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSizeNumber = pageSize
      ? parseInt(pageSize as string, 10)
      : undefined;
    const skip =
      pageNumber && pageSizeNumber
        ? (pageNumber - 1) * pageSizeNumber
        : undefined;
    const take = pageSizeNumber;

    const whereClause: any = { ...options.whereClause };

    // Permission check using req.permissionScope (from middleware)
    const permission = req.permissionScope;
    // if (!permission?.scopes?.length || permission.scopes.includes("none")) {
    //   return res.status(403).json({ message: "Forbidden: No access" });
    // }

    if (!options.excludeOrganizationId) {
      whereClause.organizationId = organizationIdNumber;
    }

    if (
      permission?.scopes.includes("own") &&
      typeof options.departmentWhereClause === "function" &&
      Array.isArray(req.user?.organizationRoles)
    ) {
      const userDepartmentIds = req.user.organizationRoles
        .filter(
          (role) =>
            role.organizationId === organizationIdNumber &&
            role.departmentId !== null
        )
        .map((role) => role.departmentId as number);

      if (!userDepartmentIds.length) {
        return res
          .status(403)
          .json({ message: "Forbidden: No departments assigned" });
      }

      Object.assign(
        whereClause,
        options.departmentWhereClause(userDepartmentIds)
      );
    }

    // Apply filters
    if (options.filters?.length) {
      for (const filterName of options.filters) {
        if (finalFilters[filterName] !== undefined) {
          const value = /^\d+$/.test(finalFilters[filterName] as string)
            ? parseInt(finalFilters[filterName] as string, 10)
            : finalFilters[filterName];
          whereClause[filterName] = value;
        }
      }
    }

    // Apply search
    if (search && options.searchFields?.length) {
      whereClause.OR = options.searchFields.map(({ path, field }) => ({
        [field]: {
          path,
          string_contains: search,
          mode: "insensitive",
        },
      }));
    }

    const orderByClause = sortField
      ? { [sortField as string]: sortDirection || "asc" }
      : options.defaultSortField
      ? { [options.defaultSortField]: "desc" }
      : undefined;

    // Include logic
    let includeClause: any = {};
    if (options.includeCounts) {
      includeClause._count = { select: options.includeCounts };
    }
    if (options.include) {
      includeClause = { ...includeClause, ...options.include };
    }
    const hasIncludes = Object.keys(includeClause).length > 0;

    const prismaModel = prismaClient[
      options.model as keyof typeof prismaClient
    ] as any;

    const isPaginated = page !== undefined && pageSize !== undefined;

    if (isPaginated) {
      const [totalCount, data] = await Promise.all([
        prismaModel.count({ where: whereClause }),
        prismaModel.findMany({
          where: whereClause,
          ...(hasIncludes && { include: includeClause }),
          skip,
          take,
          orderBy: orderByClause,
        }),
      ]);

      const transformedData = options.transformResponse
        ? options.transformResponse(data)
        : data;

      res.status(200).json({
        data: transformedData,
        totalCount,
      });
    } else {
      const data = await prismaModel.findMany({
        where: whereClause,
        ...(hasIncludes && { include: includeClause }),
        orderBy: orderByClause,
      });

      const transformedData = options.transformResponse
        ? options.transformResponse(data)
        : data;

      res.status(200).json(transformedData);
    }
  } catch (error) {
    console.error(`Error in getDynamicData for ${options.model}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUpdatedFields = (existingData: any, newData: any): any => {
  const updatedFields: any = {};

  for (const key in newData) {
    if (newData[key] !== undefined && newData[key] !== existingData[key]) {
      updatedFields[key] = newData[key];
    }
  }

  return updatedFields;
};

export function getMissingParams(
  data: Record<string, any>,
  requiredKeys: string[]
): string[] {
  return requiredKeys.filter((key) => {
    const value = data[key];
    return value === undefined || value === null || value === "";
  });
}
