// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import yup from 'yup'
import vine from '../index.js'

const data = {
  contacts: [
    {
      type: 'email',
      value: 'foo@bar.com',
    },
    {
      type: 'phone',
      value: '12345678',
    },
  ],
}

const zodSchema = z.object({
  contacts: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
    })
  ),
})

const yupSchema = yup
  .object({
    contacts: yup
      .array(
        yup
          .object({
            type: yup.string().required(),
            value: yup.string().required(),
          })
          .required()
      )
      .required(),
  })
  .required()

const vineSchema = vine.compile(
  vine.object({
    contacts: vine.array(
      vine.object({
        type: vine.string(),
        value: vine.string(),
      })
    ),
  })
)

const suite = new Benchmark.Suite()
suite
  .add('Vine', {
    defer: true,
    fn: function (deferred: any) {
      vineSchema({ data })
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .add('Zod', {
    defer: true,
    fn: function (deferred: any) {
      zodSchema
        .parseAsync(data)
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .add('Yup', {
    defer: true,
    fn: function (deferred: any) {
      yupSchema
        .validate(data)
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })