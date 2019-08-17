const catan_ig = require('./index')

const validate_test_utilities = true

class TestError extends Error
{
    constructor(...args)
    {
        super(...args)
        Error.captureStackTrace(this, this.constructor)
    }
}

function expect_error(f, success = null, match = null, assertion = null)
{
    let result

    try
    {
        result = f()
    }
    catch (error)
    {
        if (match == null || error.message == match)
        {
            if (success != null)
            {
                console.log(success)
            }

            return true
        }

        let message = `Failed to throw expected error`
        message += `${"\n"}Exception was ${error.toString()}`
        throw new TestError(message)
    }

    let message = `Failed to throw any error`
    message += `${"\n"}Result was ${result}`

    if (expected == null)
    {
        throw new TestError(message)
    }

    message += `${"\n"}Failed to throw on ${assertion}`
    throw new TestError(message)
}

function assert_state_updates_local(state_update_name, result, expected, initial, updates)
{
    if (typeof state_update_name !== "string")
    {
        throw new TestError(`Bad 'state_update_name' variable: ${state_update_name}`)
    }

    if (typeof result !== "boolean")
    {
        throw `Bad 'result' variable: ${validated}`
    }

    if (typeof expected !== "boolean")
    {
        throw `Bad 'expected' variable: ${expected}`
    }

    if (result != expected)
    {
        const json_indent = 4
        let error = TestError()
        error.message = `Failed to assert '${state_update_name}'`
        error.message += `${"\n"}Expected '${expected}' but got '${result}'`

        if (initial == null || typeof initial !== 'object')
        {
            error.message += `Initial: ${initial}`
        }
        else
        {
            error.message += `Initial: ${JSON.stringify(initial, null, json_indent)}`
        }

        if (updates == null || !Array.isArray(updates))
        {
            error.message += `Updates: ${updates}`
        }
        else
        {
            error.message += `Updates:`
            updates
                .forEach((value, index) =>
                {
                    if (value == null || typeof value !== 'object')
                    {
                        error.message += `Update ${index+1}: ${value}`
                    }
                    else
                    {
                        error.message += `Update ${index+1}: ${JSON.stringify(value, null, json_indent)}`
                    }
                })
        }

        throw error
    }
}

if (validate_test_utilities)
{
    console.log("Validating test utilities")
    expect_error(
        () => assert_state_updates_local(null, null, null, null, null),
        "Validated null 'state_update_name' variable for assert_state_updates_local throws error",
        "Bad 'state_update_name' variable: null")
    expect_error(
        () => assert_state_updates_local(5, null, null, null, null),
        "Validated non-string (int) 'state_update_name' variable for assert_state_updates_local throws error",
        "Bad 'state_update_name' variable: 5")
    expect_error(
        () => assert_state_updates_local(5, null, null, null, null),
        "Validated null 'result' variable for assert_state_updates_local because must be string",
        "Bad 'state_update_name' variable: 5")
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
