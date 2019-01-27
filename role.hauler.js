module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working === true && creep.carry.energy === 0) {
            // switch state
            creep.memory.working = false;
        }
       // console.log(creep.memory.working);

            // if creep is picking energy but is full
        else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working === true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType === STRUCTURE_SPAWN
                    || s.structureType === STRUCTURE_EXTENSION
                    || s.structureType === STRUCTURE_TOWER)
                    && s.energy < s.energyCapacity
            });

            // if we found one
            if (structure !== undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
        }



        else if (!structure || _.sum(structure.store) + creep.carry.energy >= structure.storeCapacity) {
            // Container is full, drop energy instead.
            if (creep.room.memory.storage) {
                if (creep.pos.x !== creep.room.memory.storage.x || creep.pos.y !== creep.room.memory.storage.y) {
                    let result = creep.moveTo(creep.room.memory.storage.x, creep.room.memory.storage.y);
                    if (result === ERR_NO_PATH) {
                        // Cannot reach dropoff spot, just drop energy right here then.
                        if (creep.drop(RESOURCE_ENERGY) === OK) {
                            // If there's no place to deliver, just drop the energy on the spot, somebody will probably pick it up.
                        }
                    }
                }
            }
        }

                // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var targets = creep.room.find(FIND_DROPPED_RESOURCES);
            // try to harvest energy, if the source is not in range
            if (targets.length) {
                // move towards the source
                creep.moveTo(targets[0]);
                creep.pickup(targets[0]);
            }
        }
    }
};