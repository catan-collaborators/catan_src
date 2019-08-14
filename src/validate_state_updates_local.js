function validate_state_updates_local(existing, update)
{
    if (!validate_tiles(existing, update))
    {
        return false
    }
}

function validate_tiles(existing, update)
{
    if (existing == null || typeof existing !== 'object')
    {
        return false
    }

    if (update == null || typeof update !== 'object')
    {
        return false
    }

    const tiles_key = 'tiles'

    if (!(tiles_key in existing))
    {
        return false
    }

    if (!(tiles_key in update)) 
    {
        return false
    }

    const existing_tiles = existing[tiles_key]
    const update_tiles = update[tiles_key]

    if (existing_tiles == null || !Array.isArray(existing_tiles))
    {
        return false
    }

    if  (update_tiles == null || !Array.isArray(update_tiles))
    {
        return false
    }

    // there must be 19 tiles
    if (existing_tiles.length !== 19)
    {
        return false
    }

    if (update_tiles.length !== 19)
    {
        return false
    }

    // for each pair of existing and update tiles ...
    if (!existing_tiles
        .map((e, i) => [e, update_tiles[i]])
        .every((tile_tuple) =>
        {
            const existing_tile = tile_tuple[0]
            const update_tile = tile_tuple[1]

            if (existing_tile == null || typeof existing_tile !== 'object')
            {
                return false
            }

            if (update_tile == null || typeof update_tile !== 'object')
            {
                return false
            }

            const vertices_key = 'vertices'

            if (!(vertices_key in existing_tile))
            {
                return false
            }

            if (!(vertices_key in update_tile))
            {
                return false
            }

            existing_tile_vertices = existing_tile[vertices_key]
            update_tile_vertices = update_tile[vertices_key]

            if (existing_tile_vertices == null || !Array.isArray(existing_tile_vertices))
            {
                return false
            }

            if (update_tile_vertices == null || !Array.isArray(update_tile_vertices))
            {
                return false
            }

            // tiles must have exactly 6 vertices
            if (existing_tile_vertices.length !== 6)
            {
                return false
            }

            if (update_tile_vertices.length !== 6)
            {
                return false
            }

            const edges_key = 'edges'

            if (!(edges_key in existing_tile))
            {
                return false
            }

            if (!(edges_key in update_tile))
            {
                return false
            }

            existing_tile_edges = existing_tile[edges_key]
            update_tile_edges = update_tile[edges_key]

            if (existing_tile_edges == null || !Array.isArray(existing_tile_edges))
            {
                return false
            }

            if (update_tile_edges == null || !Array.isArray(update_tile_edges))
            {
                return false
            }

            // tiles must have exactly 6 edges
            if (existing_tile_edges.length !== 6)
            {
                return false
            }

            if (update_tile_edges.length !== 6)
            {
                return false
            }

            const occupied_key = 'occupied'

            if (existing_tiles_vertices.some(existing_tile => !(occupied_key in existing_tile) || existing_tile[occupied_key] == null || typeof existing_tile[occupied_key] !== "boolean"))
            {
                return false
            }

            if (update_tiles_vertices.some(update_tile => !(occupied_key in update_tile) || update_tile[occupied_key] == null || typeof existing_tile[occupied_key] !== "boolean"))
            {
                return false
            }

            // tiles must have no less than 0, no more than 3 occupied vertices
            const num_update_vertices_occupied = update_tiles_vertices.reduce((acc, curr) => acc + curr[occupied_key])
            if (num_update_vertices_occupied < 0 || num_update_vertices_occupied > 3)
            {
                return false
            }

            const num_existing_vertices_occupied = existing_tiles_vertices.reduce((acc, curr) => acc + curr[occupied_key])
            if (num_existing_vertices_occupied < 0 || num_existing_vertices_occupied > 3)
            {
                return false
            }

            // tiles must not have any adjacent vertices
            const update_vertices_adjacent = update_tiles_vertices.reduce((acc, curr) => [acc[1] && curr[occupied_key], curr[occupied_key]], [false, false])[0]
            if (update_vertices_adjacent)
            {
                return false
            }

            const existing_vertices_adjacent = existing_tiles_vertices.reduce((acc, curr) => [acc[1] && curr[occupied_key], curr[occupied_key]], [false, false])[0]
            if (update_vertices_adjacent)
            {
                return false
            }
            
            const resource_key = 'resource'

            if (!(resource_key in update_tile))
            {
                return false
            }

            if (!(resource_key in existing_tile))
            {
                return false
            }

            const update_tile_resource = update_tile[resource_key]
            const existing_tile_resource = existing_tile[resource_key]

            if (update_tile[resource_key] == null)
            {
                return false
            }

            if (existing_tile[resource_key] == null)
            {
                return false
            }
            
            if (typeof update_tile[resource_key] !== "string")
            {
                return false
            }

            if (typeof existing_tile[resource_key] !== "string")
            {
                return false
            }

            // update tile must have the same type as existing
            if (existing_tile_resource !== update_tile_resource)
            {
                return false
            }
            
            // update tile must have at least the same properties as existing
            // TODO

            return true
        }))
    {
        return false
    }

    return true
}
