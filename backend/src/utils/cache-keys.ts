export function organizationProjectsCacheKey(
  organizationId: string,
  page: number,
  limit: number,
  search = "",
) {
  return `projects:${organizationId}:page=${page}:limit=${limit}:search=${search}`;
}
