/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Align collection schemas with the fields the OpenDS API layer needs.
  // The original created_* migrations were auto-generated from a minimal
  // schema: they omitted the standard created/updated autodate fields
  // (so sort=-created failed) and several fields the API routes require.

  // Adds created/updated autodate fields. Property assignment is used
  // because the JSVM AutodateField constructor data-map does not persist
  // reliably in v0.39.x.
  function ensureAutodate(collectionId) {
    const collection = app.findCollectionByNameOrId(collectionId)

    if (!collection.fields.getByName("created")) {
      const created = new AutodateField()
      created.name = "created"
      created.onCreate = true
      created.onUpdate = false
      collection.fields.add(created)
    }

    if (!collection.fields.getByName("updated")) {
      const updated = new AutodateField()
      updated.name = "updated"
      updated.onCreate = true
      updated.onUpdate = true
      collection.fields.add(updated)
    }

    app.save(collection)
  }

  const customCollections = [
    "pbc_284738925", // components
    "pbc_2638834880", // tokens
    "pbc_1985629191", // docs
    "pbc_2769025244", // settings
    "pbc_3577178630", // api_keys
  ]

  const components = app.findCollectionByNameOrId("pbc_284738925")

  for (const def of [
    { name: "display_name", max: 255 },
    { name: "category", max: 100 },
    { name: "status", max: 50 },
    { name: "version", max: 50 },
  ]) {
    if (!components.fields.getByName(def.name)) {
      components.fields.add(
        new TextField({
          name: def.name,
          max: def.max,
          min: 0,
          pattern: "",
          autogeneratePattern: "",
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
        }),
      )
    }
  }

  const apiKeys = app.findCollectionByNameOrId("pbc_3577178630")
  if (!apiKeys.fields.getByName("user_id")) {
    apiKeys.fields.add(
      new TextField({
        name: "user_id",
        max: 100,
        min: 0,
        pattern: "",
        autogeneratePattern: "",
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
      }),
    )
  }

  // Built-in users collection — add the fields the OpenDS API layer relies on
  const users = app.findCollectionByNameOrId("_pb_users_auth_")
  if (!users.fields.getByName("role")) {
    users.fields.add(
      new SelectField({
        name: "role",
        values: ["admin", "editor", "viewer"],
        maxSelect: 1,
        presentable: false,
        required: false,
        system: false,
      }),
    )
  }
  if (!users.fields.getByName("is_active")) {
    users.fields.add(
      new BoolField({
        name: "is_active",
        presentable: false,
        required: false,
        system: false,
      }),
    )
  }

  app.save(components)
  app.save(apiKeys)
  app.save(users)

  for (const collectionId of customCollections) {
    ensureAutodate(collectionId)
  }
}, (app) => {
  const components = app.findCollectionByNameOrId("pbc_284738925")

  for (const name of ["display_name", "category", "status", "version"]) {
    const field = components.fields.getByName(name)
    if (field) components.fields.remove(field)
  }

  const apiKeys = app.findCollectionByNameOrId("pbc_3577178630")
  const userField = apiKeys.fields.getByName("user_id")
  if (userField) apiKeys.fields.remove(userField)

  const users = app.findCollectionByNameOrId("_pb_users_auth_")
  const roleField = users.fields.getByName("role")
  if (roleField) users.fields.remove(roleField)
  const activeField = users.fields.getByName("is_active")
  if (activeField) users.fields.remove(activeField)

  const customCollections = [
    "pbc_284738925",
    "pbc_2638834880",
    "pbc_1985629191",
    "pbc_2769025244",
    "pbc_3577178630",
  ]
  for (const collectionId of customCollections) {
    const collection = app.findCollectionByNameOrId(collectionId)
    for (const name of ["created", "updated"]) {
      const field = collection.fields.getByName(name)
      if (field) collection.fields.remove(field)
    }
    app.save(collection)
  }

  app.save(components)
  app.save(apiKeys)
  app.save(users)
})
