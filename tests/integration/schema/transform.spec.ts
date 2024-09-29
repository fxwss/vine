/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import vine from '../../../index.js'

test.group('Transform', () => {
  const schema = vine.object({
    name: vine.string().transform(async (value) => {
      return `${value} | awaited`
    }),
  })

  const data = { name: 'virk' }

  test('pass when value is extracted from Promise', async ({ assert }) => {
    const { name } = await vine.validate({ schema, data, shouldAwaitTransformers: true })
    assert.equal(name, 'virk | awaited')
  })

  test('fail when value is not extracted from Promise', async ({ assert }) => {
    const { name } = await vine.validate({ schema, data, shouldAwaitTransformers: false })
    assert.isTrue(name instanceof Promise)
  })
})
