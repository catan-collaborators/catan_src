const catan_ig = require('./index')

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
        if (match == null)
        {
            return true
        }

        if (error.message != match)
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

        success += `: ${match}`

        if (success != null)
        {
            // print message green
            console.log(`\x1b[32m${success}\x1b[0m`)
        }

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
        throw new Error(`Bad 'result' variable: ${validated == null ? validated : validated.toString()}`)
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
}

if (validate_test_utilities)
{
    console.log("Validating test utilities")

    let undefined_var
    let null_var = null
    let nan_var = Number.NaN
    let number_var = 5
    let bool_var = false
    let obj_var = {}
    let sym_var = Symbol()

    expect_error(
        () => assert_state_updates_local(undefined_var, null, null, null, null),
        `Validated non-string (${typeof undefined_var}) value '${undefined_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: undefined",
        "Assert state_update_name is not undefined")
    expect_error(
        () => assert_state_updates_local(null_var, null, null, null, null),
        `Validated non-string (null) value '${null_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: null",
        "Assert state_update_name is not null")
    expect_error(
        () => assert_state_updates_local(nan_var, null, null, null, null),
        `Validated non-string (${typeof nan_var}) value '${nan_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: NaN",
        "Assert state_update_name is not number (NaN)")
    expect_error(
        () => assert_state_updates_local(number_var, null, null, null, null),
        `Validated non-string (${typeof number_var}) value '${number_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: 5",
        "Assert state_update_name is not number")
    expect_error(
        () => assert_state_updates_local(bool_var, null, null, null, null),
        `Validated non-string (${typeof bool_var}) value '${bool_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: false",
        "Assert state_update_name is not boolean")
    expect_error(
        () => assert_state_updates_local(obj_var, null, null, null, null),
        `Validated non-string (${typeof obj_var}) value '${obj_var}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: [object Object]",
        "Assert state_update_name is not object")
    expect_error(
        () => assert_state_updates_local(sym_var, null, null, null, null),
        `Validated non-string (${typeof sym_var}) value '${sym_var.toString()}' for 'state_update_name' variable for function 'assert_state_updates_local' throws error`,
        "Bad 'state_update_name' variable: Symbol()",
        "Assert state_update_name is not symbol")
    expect_error(() => assert_state_updates_local(5, null, null, null, null))
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
