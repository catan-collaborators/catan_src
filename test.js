const catan_ig = require('./index')

const counter = {} 
counter.val = 0

const validate_test_utilities = true
const json_indent = 4

function expect_error(f, success = null, match = null, assertion = undefined)
{
    let result

    try
    {
        result = f()
    }
    catch (error)
    {
        if (match != null && error.message != match)
        {
            let message = `\x1b[31mFailed to throw expected error`
            message += `${"\n"}Exception was ${error.message}`

            if (assertion != null)
            {
                message += `${"\n"}Assertion was ${assertion}`
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
    message += `${"\n"}Result was ${result == null ? result : result.toString()}`

    if (assertion != null)
    {
        message += `${"\n"}Failed to throw on ${assertion}`
    }

    message += `\x1b[0m`
    throw new Error(message)
}

function assert_state_updates_local(state_update_name, result, expected, initial, updates)
{
    if (typeof state_update_name !== "string")
    {
        throw new Error(`Bad 'state_update_name' variable: ${state_update_name == null ? state_update_name : state_update_name.toString()}`)
    }

    if (typeof result !== "boolean")
    {
        throw new Error(`Bad 'result' variable: ${result == null ? result : result.toString()}`)
    }

    if (typeof expected !== "boolean")
    {
        throw new Error(`Bad 'expected' variable: ${expected == null ? expected : expected.toString()}`)
    }

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
}

if (validate_test_utilities)
{
    console.log("Validating test utilities")

    let undefined_var
    let null_var = null
    let nan_var = Number.NaN
    let num_var = 5
    let bool_var = false
    let str_var = "hello world"
    let obj_var = {}
    let sym_var = Symbol()
    let fun_var = () => {;}

    expect_error(
        () => assert_state_updates_local(undefined_var, null, null, null, null),
        `Validated non-string (${typeof undefined_var}) value '${undefined_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: undefined",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not undefined")
    expect_error(
        () => assert_state_updates_local(null_var, null, null, null, null),
        `Validated non-string (null) value '${null_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: null",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not null")
    expect_error(
        () => assert_state_updates_local(nan_var, null, null, null, null),
        `Validated non-string (${typeof nan_var}) value '${nan_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: NaN",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not number (NaN)")
    expect_error(
        () => assert_state_updates_local(num_var, null, null, null, null),
        `Validated non-string (${typeof num_var}) value '${num_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: 5",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not number")
    expect_error(
        () => assert_state_updates_local(bool_var, null, null, null, null),
        `Validated non-string (${typeof bool_var}) value '${bool_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: false",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not boolean")
    expect_error(
        () => assert_state_updates_local(obj_var, null, null, null, null),
        `Validated non-string (${typeof obj_var}) value '${obj_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: [object Object]",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not object")
    expect_error(
        () => assert_state_updates_local(sym_var, null, null, null, null),
        `Validated non-string (${typeof sym_var}) value '${sym_var.toString()}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: Symbol()",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not symbol")
    expect_error(
        () => assert_state_updates_local(fun_var, null, null, null, null),
        `Validated non-string (${typeof fun_var}) value '${fun_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: () => {;}",
        "Assert 'state_update_name' in function 'assert_state_updates_local' is not function")

    expect_error(
        () => assert_state_updates_local("Test case 1", undefined_var, null, null, null),
        `Validated non-boolean (${typeof undefined_var}) value '${undefined_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: undefined",
        "Assert 'result' in function 'assert_state_updates_local' is not undefined")
    expect_error(
        () => assert_state_updates_local("Test case 1", null_var, null, null, null),
        `Validated non-boolean (null) value '${null_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: null",
        "Assert 'result' in function 'assert_state_updates_local' is not null")
    expect_error(
        () => assert_state_updates_local("Test case 1", nan_var, null, null, null),
        `Validated non-boolean (${typeof nan_var}) value '${nan_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: NaN",
        "Assert 'result' in function 'assert_state_updates_local' is not number (NaN)")
    expect_error(
        () => assert_state_updates_local("Test case 1", num_var, null, null, null),
        `Validated non-boolean (${typeof num_var}) value '${num_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: 5",
        "Assert 'result' in function 'assert_state_updates_local' is not number")
    expect_error(
        () => assert_state_updates_local("Test case 1", str_var, null, null, null),
        `Validated non-boolean (${typeof str_var}) value '${str_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: hello world",
        "Assert 'result' in function 'assert_state_updates_local' is not string")
    expect_error(
        () => assert_state_updates_local("Test case 1", obj_var, null, null, null),
        `Validated non-boolean (${typeof obj_var}) value '${obj_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: [object Object]",
        "Assert 'result' in function 'assert_state_updates_local' is not object")
    expect_error(
        () => assert_state_updates_local("Test case 1", sym_var, null, null, null),
        `Validated non-boolean (${typeof sym_var}) value '${sym_var.toString()}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: Symbol()",
        "Assert 'result' in function 'assert_state_updates_local' is not symbol")
    expect_error(
        () => assert_state_updates_local("Test case 1", fun_var, null, null, null),
        `Validated non-boolean (${typeof fun_var}) value '${fun_var}' for 'result' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'result' variable: () => {;}",
        "Assert 'result' in function 'assert_state_updates_local' is not symbol")

    expect_error(
        () => assert_state_updates_local("Test case 1", true, undefined_var, null, null),
        `Validated non-boolean (${typeof undefined_var}) value '${undefined_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: undefined",
        "Assert 'expected' in function 'assert_state_updates_local' is not undefined")
    expect_error(
        () => assert_state_updates_local("Test case 1", true, null_var, null, null),
        `Validated non-boolean (null) value '${null_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: null",
        "Assert 'expected' in function 'assert_state_updates_local' is not null")
    expect_error(
        () => assert_state_updates_local("Test case 1", true, nan_var, null, null),
        `Validated non-boolean (${typeof nan_var}) value '${nan_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: NaN",
        "Assert 'expected' in function 'assert_state_updates_local' is not number (NaN)")
    expect_error(
        () => assert_state_updates_local("Test case 1", true, num_var, null, null),
        `Validated non-boolean (${typeof num_var}) value '${num_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: 5",
        "Assert 'expected' in function 'assert_state_updates_local' is not number")
    expect_error(
        () => assert_state_updates_local("Test case 1", true, str_var, null, null),
        `Validated non-boolean (${typeof str_var}) value '${str_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: hello world",
        "Assert 'expected' in function 'assert_state_updates_local' is not string")
    expect_error(
        () => assert_state_updates_local("Test case 1", true, obj_var, null, null),
        `Validated non-boolean (${typeof obj_var}) value '${obj_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: [object Object]",
        "Assert 'expected' in function 'assert_state_updates_local' is not object")
    expect_error(
        () => assert_state_updates_local("Test case 1", true, sym_var, null, null),
        `Validated non-boolean (${typeof sym_var}) value '${sym_var.toString()}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: Symbol()",
        "Assert 'expected' in function 'assert_state_updates_local' is not symbol")
    expect_error(
        () => assert_state_updates_local("Test case 1", true, fun_var, null, null),
        `Validated non-boolean (${typeof fun_var}) value '${fun_var}' for 'expected' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'expected' variable: () => {;}",
        "Assert 'expected' in function 'assert_state_updates_local' is not symbol")

    console.log(`${counter.val} ${counter.val == 1 ? 'test' : 'tests'} asserted`)
    console.log("")
}

console.log("Validating local state updates")
catan_ig.validate_state_updates_local({}, [])
console.log("")

console.log("Validating state update attempts")
catan_ig.attempt_state_updates({}, [])
console.log("")

console.log("Validating update processing")
catan_ig.process_updates({}, [])
console.log("")
