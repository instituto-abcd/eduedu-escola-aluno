import { useEffect, useState, SetStateAction } from 'react'
import { paginationOptions } from '~/constants'

export type usePaginationOptions = {
    page: number
    pageSize: number
    setPage: React.Dispatch<SetStateAction<number>>
    setPageSize: React.Dispatch<SetStateAction<number>>
}

export const usePagination = (): usePaginationOptions => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(Number(paginationOptions[0].value))

    useEffect(() => {
        setPage(1)
    }, [pageSize])

    return { page, pageSize, setPage, setPageSize }
}