import * as React from 'react'
import { shallow } from 'enzyme'

import { testAdmin, testProvider } from '../../setupTests'
import { ResourceComposer, Resource, AdminResource } from '../index'
import { RenderList } from '../RenderList'
import { RenderDetail } from '../../DetailView/RenderDetail'

test('ResourceComposer mounts router with children', () => {
  const wrapper = shallow(
    <ResourceComposer withSideBar={false} permissions={[]}>
      <Resource name="test2">
        <></>
      </Resource>
      <AdminResource name="test" admin={testAdmin} provider={testProvider} user={undefined} analytics={undefined} />
      <AdminResource name="test2" admin={testAdmin} provider={testProvider} user={undefined} analytics={undefined} />
    </ResourceComposer>
  )

  expect(wrapper.find('BrowserRouter').length).toEqual(1)
  expect(wrapper.find('Resource').length).toEqual(1)
  expect(wrapper.find('AdminResource').length).toEqual(2)
})

test('Resource mounts properly', () => {
  const wrapper = shallow(
    <AdminResource name="test" admin={testAdmin} provider={testProvider} user={undefined} analytics={undefined} />
  )

  expect(wrapper.find('Switch').length).toEqual(1)
  expect(wrapper.find('Route').length).toEqual(2)
  expect(wrapper.find(RenderList).length).toEqual(1)
  expect(wrapper.find(RenderDetail).length).toEqual(1)
})
