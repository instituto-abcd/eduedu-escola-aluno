import { paginationOptions } from "~/constants";
import {
    Flex,
    Group,
    Text,
    Select,
    Pagination as PaginationMantine
} from "@mantine/core"
import { usePaginationOptions } from "~/hooks/usePagination";
''
type PaginationOptions = {
    paginationHook: usePaginationOptions
    paginationApi: {
        "totalItems": number,
        "pageSize": number,
        "pageNumber": number,
        "totalPages": number,
        "previousPage": number,
        "nextPage": number,
        "lastPage": number,
        "hasPreviousPage": boolean,
        "hasNextPage": boolean
    }
}

export function Pagination({ paginationHook, paginationApi }: PaginationOptions) {

    return (
        <Group position="apart">
            <div></div>
            <Flex align="center" justify="center">
                <PaginationMantine
                    onChange={paginationHook.setPage}
                    value={paginationApi.pageNumber}
                    total={paginationApi.totalPages}
                    withControls={false}
                />
            </Flex>
            <Group align="center" spacing={24} noWrap>
                <Text>Exibir</Text>
                <Select
                    withinPortal
                    value={String(paginationHook.pageSize)}
                    onChange={(value) => { paginationHook.setPageSize(Number(value)) }}
                    data={paginationOptions}
                    size="xs"
                    style={{ maxWidth: "60px" }}
                />
                <Text>registros por página</Text>
            </Group>
        </Group>
    )
}