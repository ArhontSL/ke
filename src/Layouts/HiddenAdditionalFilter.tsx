import React, { PropsWithChildren, useState } from 'react'
import { Box, Button, Flex } from '@chakra-ui/react'
import { makeSlots } from '@cdk/Layouts'

const Additional = ({ children, isOpen }: PropsWithChildren<{ isOpen: boolean }>): JSX.Element | null =>
  isOpen ? (
    <Flex flexWrap="wrap" border="1px" borderColor="gray.200" borderRadius="md" my={2} p={3}>
      {children}
    </Flex>
  ) : null
const Buttons = ({ isOpen, additionalHandler }: { isOpen: boolean; additionalHandler: () => void }): JSX.Element => (
  <Box ml={2}>
    <Button mr={2} isActive={isOpen} onClick={additionalHandler}>
      {isOpen ? 'Скрыть фильтры' : 'Раскрыть фильтры'}
    </Button>
  </Box>
)

export const HiddenAdditionalFilter = makeSlots(
  {
    main: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
    buttons: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
    additional: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
  },
  (slotElements) => {
    const [additional, setAdditional] = useState(false) // eslint-disable-line
    const handleClick = (): void => {
      setAdditional(!additional)
    }
    return (
      <Flex flexWrap="wrap">
        <Box flex="2 0 0%">{slotElements.main}</Box>
        <Box flex="1 0 0%">
          <Buttons isOpen={additional} additionalHandler={handleClick} />
        </Box>
        <Box flex="1 0 100%">
          <Additional isOpen={additional}>{slotElements.additional}</Additional>
        </Box>
      </Flex>
    )
  }
)
