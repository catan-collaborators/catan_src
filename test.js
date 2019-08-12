const catan_ig = require('./index')
const _ = require('underscore')

function assert_state_updates_local(state_update_name, validated, expected, initial, updates)
{
    if (!validated)
    {
        console.error(`Failed to assert ${state_update_name}`)
        console.error(`Expected: ${JSON.parse(expected, null, )}`)
        console.error(`Initial: ${JSON.parse(expected, null, )}`)
        _.each(updates, function (element, index, list) { console.error(`Update ${index+1}: ${element}`) })
        throw `Failed to assert ${state_update_name}`
    }
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
