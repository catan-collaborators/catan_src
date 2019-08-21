const validate_state_updates_local = require('./src/validate_state_updates_local.js')
const attempt_state_updates = require('./src/attempt_state_updates.js')
const process_updates = require('./src/process_updates.js')

const settings =
{
    'verbosity': 'none'
}

exports.validate_state_updates_local = function (original, updates)
{
    if (settings.verbose === 'verbose')
    {
        console.log('Validating state updates') 
    }

    // TODO
    return validate_state_updates_local.validate_state_updates_local(original, updates)
}

exports.attempt_state_updates = function(original, updates)
{
    if (settings.verbose === 'verbose')
    {
        console.log('Attempting state updates')
    }

    // TODO
    return attempt_state_updates.attempt_state_updates(original, updates)
}

exports.process_updates = function (original, updates)
{
    if (settings.verbose === 'verbose')
    {
        console.log('Processing updates') 
    }

    // TODO
    return process_updates.process_updates(original, updates)
}
