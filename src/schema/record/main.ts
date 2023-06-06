/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { RefsStore, RecordNode } from '@vinejs/compiler/types'

import { BaseType } from '../base.js'
import { ParserOptions, SchemaTypes } from '../../types.js'
import { BRAND, CBRAND, PARSE } from '../../symbols.js'

/**
 * VineRecord represents an object of key-value pair in which
 * keys are unknown
 */
export class VineRecord<Schema extends SchemaTypes> extends BaseType<
  { [K: string]: Schema[typeof BRAND] },
  { [K: string]: Schema[typeof CBRAND] }
> {
  #schema: Schema

  constructor(schema: Schema) {
    super()
    this.#schema = schema
  }

  /**
   * Compiles to array data type
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): RecordNode {
    return {
      type: 'record',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      each: this.#schema[PARSE]('*', refs, options),
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.compileValidations(refs),
    }
  }
}