module.exports = async (Model, values, options) => {
  return await Model
    .findOne({ where: { id: values.id || -1 } })
    .then(async function (obj) {
      if (!options) 
          options = {}

        if(obj) { // update
          return await obj.update(values, {individualHooks: true, ...options});
        }
        else { // insert
          const {id, ...payload} = values
          return await Model.create(payload, {...options});
        }
    })
}