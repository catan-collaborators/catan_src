const catan_ig = require('./index')

const validate_test_utilities = true
const json_indent = 4

const counter = { 'val': 0 }

const keys =
{
    'value_key': 'value',
    'detail_key': 'detail'
}

function truthify_and_assert(func, expected)
{
    let result

    try
    {
        result = func()
    }
    catch (error)
    {
        let message = `\x1b[31mUnexpectedly threw error`
        message += `${"\n"}Function call was ${func.toString()}`
        message += `${"\n"}Exception was: ${error.message}`
        message += `\x1b[0m`
        error.message = message
        throw error
    }

    if (typeof result === "boolean")
    {
        if (result != expected)
        {
            let message = `\x1b[31mResult did not match expected value`
            message += `${"\n"}Function call was ${func.toString()}`
            message += `${"\n"}Expected value was ${expected}`
            message += `${"\n"}Returned value was ${result == null ? result : result.toString()}`
            message += `\x1b[0m`
            throw new Error(message)
        }

        return result
    }

    if (result == null || typeof result !== "object")
    {
        let message = `\x1b[31mFunction call returned incorrect type`
        message += `${"\n"}Function call was ${func.toString()}`
        message += `${"\n"}Returned value was ${result == null ? result : result.toString()}`
        message += `\x1b[0m`
        throw new Error(message)
    }

    const value_key = keys.value_key
    const detail_key = keys.detail_key
    
    if (!(value_key in result))
    {
        let message = `\x1b[31mFunction call returned non-truthy object`
        message += `${"\n"}Function call was ${func.toString()}`
        message += `${"\n"}Exception was: ${error.message}`
        message += `${"\n"}Returned value was ${result == null ? result : result.toString()}`

        if (detail_key in result)
        {
            message += `${"\n"}Detail: ${result[detail_key] == null ? result[detail_key] : result[detail_key].toString()}`
        }

        message += `\x1b[0m`
        error.message = message
        throw error
    }

    if (result[value_key] != expected)
    {
        let message = `\x1b[31mResult did not match expected value`
        message += `${"\n"}Function call was ${func.toString()}`
        message += `${"\n"}Expected value was ${expected}`
        message += `${"\n"}Returned value was ${result}`

        if (detail_key in result)
        {
            message += `${"\n"}Detail: ${result[detail_key] == null ? result[detail_key] : result[detail_key].toString()}`
        }

        message += `\x1b[0m`
        error.message = message
        throw new Error(message)
    }
    
    return result[value_key]
}

function expect_no_error(func, expected, success = undefined, assertion = undefined)
{
    let result

    try
    {
        result = func()
    }
    catch (error)
    {
        let message = `\x1b[31mUnexpectedly threw error`
        message += `${"\n"}Function call was ${func.toString()}`
        message += `${"\n"}Exception was: ${error.message}`

        if (assertion != null)
        {
            message += `${"\n"}Assertion was: ${assertion}`
        }

        message += `\x1b[0m`
        error.message = message
        throw error
    }

    if (expected != result)
    {
        let message = `\x1b[31mResult did not match expected value`
        message += `${"\n"}Function call was ${func.toString()}`
        message += `${"\n"}Expected value was ${expected}`
        message += `${"\n"}Returned value was ${result}`

        if (assertion != null)
        {
            message += `${"\n"}Assertion was: ${assertion}`
        }

        message += `\x1b[0m`
        throw new Error(message)
    }

    if (success != null)
    {
        console.log(`\x1b[32m${success}\x1b[0m`)
    }

    counter.val++
    return true
}

function expect_error(func, success = undefined, match = undefined, assertion = undefined)
{
    let result

    try
    {
        result = func()
    }
    catch (error)
    {
        if (match != null && error.message != match)
        {
            let message = `\x1b[31mFailed to throw expected error`
            message += `${"\n"}Function call was ${func.toString()}`
            message += `${"\n"}Exception was: ${error.message}`

            if (assertion != null)
            {
                message += `${"\n"}Assertion was: ${assertion}`
            }

            message += `\x1b[0m`
            error.message = message
            throw error
        }

        if (match != null && success != null)
        {
            success += `: ${match}`
        }

        if (success != null)
        {
            console.log(`\x1b[32m${success}\x1b[0m`)
        }

        counter.val++
        return true
    }

    let message = `\x1b[31mFailed to throw any error`
    message += `${"\n"}Function call was ${func.toString()}`
    message += `${"\n"}Result was ${result == null ? result : result.toString()}`

    if (assertion != null)
    {
        message += `${"\n"}Failed to throw on ${assertion}`
    }

    message += `\x1b[0m`
    throw new Error(message)
}

function assert_state_updates_local(state_update_name, action, expected, initial, updates)
{
    if (typeof state_update_name !== "string")
    {
        throw new Error(`Bad 'state_update_name' variable: ${state_update_name == null ? state_update_name : state_update_name.toString()}`)
    }

    if (typeof action !== "function")
    {
        throw new Error(`Bad 'result' variable: ${action == null ? action : action.toString()}`)
    }

    if (typeof expected !== "boolean")
    {
        throw new Error(`Bad 'expected' variable: ${expected == null ? expected : expected.toString()}`)
    }

    const result = action(initial, updates)

    if (result != expected)
    {
        let message = `Failed to assert '${state_update_name}'`
        message += `${"\n"}Expected '${expected}' but got '${result}'`

        if (initial == null || typeof initial !== 'object')
        {
            message += `${"\n"}Initial: ${initial == null ? initial : initial.toString()}`
        }
        else
        {
            message += `${"\n"}Initial: ${JSON.stringify(initial, null, json_indent)}`
        }

        if (updates == null || !Array.isArray(updates))
        {
            message += `${"\n"}Updates: ${updates == null ? updates : updates.toString()}`
        }
        else
        {
            message += `${"\n"}Updates:`
            updates
                .forEach((value, index) =>
                {
                    if (value == null || typeof value !== 'object')
                    {
                        message += `${"\n"}Update ${index+1}: ${value}`
                    }
                    else
                    {
                        message += `${"\n"}Update ${index+1}: ${JSON.stringify(value, null, json_indent)}`
                    }
                })
        }

        throw new Error(message)
    }

    counter.val++
    return result
}

if (validate_test_utilities)
{
    console.log("Validating test utilities")

    let undefined_var
    const null_var = null
    const nan_var = Number.NaN
    const num_var = 5
    const bool_var = false
    const str_var = "hello world"
    const obj_var = {}
    const sym_var = Symbol()
    const func_var = () => {;}

    expect_error(
        () => assert_state_updates_local(undefined_var, null, null, null, null),
        `Validated non-string (${typeof undefined_var}) value '${undefined_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: undefined",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not undefined")
    expect_error(
        () => assert_state_updates_local(null_var, null, null, null, null),
        `Validated non-string (null) value '${null_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: null",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not null")
    expect_error(
        () => assert_state_updates_local(nan_var, null, null, null, null),
        `Validated non-string (${typeof nan_var}) value '${nan_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: NaN",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not number (NaN)")
    expect_error(
        () => assert_state_updates_local(num_var, null, null, null, null),
        `Validated non-string (${typeof num_var}) value '${num_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: 5",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not number")
    expect_error(
        () => assert_state_updates_local(bool_var, null, null, null, null),
        `Validated non-string (${typeof bool_var}) value '${bool_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: false",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not boolean")
    expect_error(
        () => assert_state_updates_local(obj_var, null, null, null, null),
        `Validated non-string (${typeof obj_var}) value '${obj_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: [object Object]",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not object")
    expect_error(
        () => assert_state_updates_local(sym_var, null, null, null, null),
        `Validated non-string (${typeof sym_var}) value '${sym_var.toString()}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: Symbol()",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not symbol")
    expect_error(
        () => assert_state_updates_local(func_var, null, null, null, null),
        `Validated non-string (${typeof func_var}) value '${func_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: () => {;}",
        "Assert 'state_update_name' variable in function 'assert_state_updates_local' is not function")

    expect_error(
        () => assert_state_updates_local("Test case 1", undefined_var, null, null, null),
        `Validated non-function (${typeof undefined_var}) value '${undefined_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: undefined",
        "Assert 'result' variable in function 'assert_state_updates_local' is not undefined")
    expect_error(
        () => assert_state_updates_local("Test case 1", null_var, null, null, null),
        `Validated non-function (null) value '${null_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: null",
        "Assert 'result' variable in function 'assert_state_updates_local' is not null")
    expect_error(
        () => assert_state_updates_local("Test case 1", nan_var, null, null, null),
        `Validated non-function (${typeof nan_var}) value '${nan_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: NaN",
        "Assert 'result' variable in function 'assert_state_updates_local' is not number (NaN)")
    expect_error(
        () => assert_state_updates_local("Test case 1", num_var, null, null, null),
        `Validated non-function (${typeof num_var}) value '${num_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: 5",
        "Assert 'result' variable in function 'assert_state_updates_local' is not number")
    expect_error(
        () => assert_state_updates_local("Test case 1", bool_var, null, null, null),
        `Validated non-function (${typeof bool_var}) value '${bool_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: false",
        "Assert 'result' variable in function 'assert_state_updates_local' is not boolean")
    expect_error(
        () => assert_state_updates_local("Test case 1", str_var, null, null, null),
        `Validated non-function (${typeof str_var}) value '${str_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: hello world",
        "Assert 'result' variable in function 'assert_state_updates_local' is not string")
    expect_error(
        () => assert_state_updates_local("Test case 1", obj_var, null, null, null),
        `Validated non-function (${typeof obj_var}) value '${obj_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: [object Object]",
        "Assert 'result' variable in function 'assert_state_updates_local' is not object")
    expect_error(
        () => assert_state_updates_local("Test case 1", sym_var, null, null, null),
        `Validated non-function (${typeof sym_var}) value '${sym_var.toString()}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: Symbol()",
        "Assert 'result' variable in function 'assert_state_updates_local' is not symbol")

    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, undefined_var, null, null),
        `Validated non-boolean (${typeof undefined_var}) value '${undefined_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: undefined",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not undefined")
    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, null_var, null, null),
        `Validated non-boolean (null) value '${null_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: null",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not null")
    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, nan_var, null, null),
        `Validated non-boolean (${typeof nan_var}) value '${nan_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: NaN",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not number (NaN)")
    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, num_var, null, null),
        `Validated non-boolean (${typeof num_var}) value '${num_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: 5",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not number")
    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, str_var, null, null),
        `Validated non-boolean (${typeof str_var}) value '${str_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: hello world",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not string")
    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, obj_var, null, null),
        `Validated non-boolean (${typeof obj_var}) value '${obj_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: [object Object]",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not object")
    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, sym_var, null, null),
        `Validated non-boolean (${typeof sym_var}) value '${sym_var.toString()}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: Symbol()",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not symbol")
    expect_error(
        () => assert_state_updates_local("Test case 1", catan_ig.validate_state_updates_local, func_var, null, null),
        `Validated non-boolean (${typeof func_var}) value '${func_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: () => {;}",
        "Assert 'expected' variable in function 'assert_state_updates_local' is not symbol")

    console.log(`${counter.val} ${counter.val == 1 ? 'test' : 'tests'} asserted`)
    console.log("")
}


console.log("Validating local state updates")
{
    let initial
    let updates

    expect_no_error(
        () => assert_state_updates_local("Type validation 1", catan_ig.validate_state_updates_local, false, initial, updates),
        false,
        `Validated 'initial=${initial}', 'updates=${updates}' for function 'catan_ig.validate_state_updates_local' returns 'false'`,
        "Assert 'initial=undefined', 'updates=undefined' returns false")

    updates = null
    expect_no_error(
        () => assert_state_updates_local("Type validation 2", catan_ig.validate_state_updates_local, false, initial, updates),
        false,
        `Validated 'initial=${initial}', 'updates=${updates}' for function 'catan_ig.validate_state_updates_local' returns 'false'`,
        "Assert 'initial=undefined', 'updates=null' returns false")

    initial = null
    updates = undefined
    expect_no_error(
        () => assert_state_updates_local("Type validation 3", catan_ig.validate_state_updates_local, false, initial, updates),
        false,
        `Validated 'initial=${initial}', 'updates=${updates}' for function 'catan_ig.validate_state_updates_local' returns 'false'`,
        "Assert 'initial=null', 'updates=undefined' returns false")

    updates = null
    expect_no_error(
        () => assert_state_updates_local("Type validation 4", catan_ig.validate_state_updates_local, false, initial, updates),
        false,
        `Validated 'initial=${initial}', 'updates=${updates}' for function 'catan_ig.validate_state_updates_local' returns 'false'`,
        "Assert 'initial=null', 'updates=null' returns false")

    // TODO: more room for type validations

    expect_no_error(
        () => truthify_and_assert(() => assert_state_updates_local("Empty inputs", catan_ig.validate_state_updates_local, false, {}, [], false), false),
        false,
        `Validated 'initial=${JSON.stringify({})}', 'updates=${JSON.stringify([])}' for function 'catan_ig.validate_state_updates_local' returns 'false'`,
        "Assert 'initial={}', 'updates=[]' returns false")
}

console.log("")

console.log("Validating state update attempts")
catan_ig.attempt_state_updates({}, [])
console.log("")

console.log("Validating update processing")
catan_ig.process_updates({}, [])
console.log("")
