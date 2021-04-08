import React, { PropsWithChildren } from 'react'
import { Box, Button, Flex } from '@chakra-ui/core'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { useApiState, useChangeEffect } from '@cdk/Hooks'
import { makeSlots, makeWithLayout } from '@cdk/Layouts'

const PaginationLayout = makeSlots(
  {
    ToFirst: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
    ToPrev: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
    Pages: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
    ToNext: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
    ToLast: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
  },
  (slotElements) => (
    <Flex>
      <Box flex={1}>{slotElements.ToFirst}</Box>
      <Box flex={1}>{slotElements.ToPrev}</Box>
      <Box flex={4}>{slotElements.Pages}</Box>
      <Box flex={1}>{slotElements.ToNext}</Box>
      <Box flex={1}>{slotElements.ToLast}</Box>
    </Flex>
  )
)

export const Pagination = makeWithLayout(({ value, onChange, totalCount }: PaginationProps) => {
  const [page, { toFirst, prev, toLast, next }] = useApiState(value, {
    toFirst: () => 1,
    next: (p: number) => (p < totalCount ? p + 1 : p),
    prev: (p: number) => (p > 1 ? p - 1 : p),
    toLast: () => totalCount,
  })

  useChangeEffect(() => onChange(page), [page, onChange])

  return {
    ToFirst: (
      <Button onClick={() => toFirst()}>
        <FiChevronsLeft />
      </Button>
    ),
    ToPrev: (
      <Button onClick={() => prev()}>
        <FiChevronLeft />
      </Button>
    ),
    Pages: `${page} / ${totalCount}`,
    ToNext: (
      <Button onClick={() => next()}>
        <FiChevronRight />
      </Button>
    ),
    ToLast: (
      <Button onClick={() => toLast()}>
        <FiChevronsRight />
      </Button>
    ),
  }
}, PaginationLayout)

interface PaginationProps {
  value: number
  onChange: (val: number) => void
  totalCount: number
}
