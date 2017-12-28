import Association from 'model/entities/Association';

/**
 * Maps dbo to association model
 * @param {object} dbo
 * @return {Association}
 */
export default function dboToAssociation(dbo) {
    const model = new Association();

    model.id = dbo._id;
    model.mindsetId = dbo.mindsetId;
    model.fromId = dbo.fromId;
    model.toId = dbo.toId;
    model.value = dbo.value;
    model.weight = dbo.weight;

    return model;
}