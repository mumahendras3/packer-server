# Packer Server Endpoints Documentation

## Endpoint List

### Public

1. [`POST /register`](#post-register)
1. [`POST /login`](#post-login)

### Access Token Required

1. [`GET /repos`](#get-repos)
1. [`POST /repos`](#post-repos)
1. [`PATCH /repos`](#patch-repos)
1. [`GET /tasks`](#get-tasks)
1. [`POST /tasks`](#post-tasks)
1. [`POST /tasks/:id`](#post-tasksid)
1. [`GET /tasks/:id/status`](#get-tasksidstatus)
1. [`GET /tasks/:id/logs`](#get-tasksidlogs)
1. [`DELETE /repos/:id`](#delete-reposid)
1. [`DELETE /tasks/:id`](#delete-tasksid)

## POST /register

Description: Register a new user

Request:

- body:

```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

Response:

- *201 - Created*:

```json
{
  "message": "Registration successful",
  "email": "<newly_registered_user_email>",
  "name": "<newly_registered_user_name>"
}
```

- *400 - Bad Request*:

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "This email has already been registered"
}
OR
{
  "message": "Password is required"
}
```

## POST /login

Description: Get an access token for accessing protected endpoints

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

- *200 - OK*:

```json
{
  "access_token": "<jwt_token>"
}
```

- *400 - Bad Request*:

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

- *401 - Unauthorized*:

```json
{
  "message": "Invalid email/password"
}
```

## GET /repos

Description: List all repos in the authenticated user's watch list

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

Response:

- *200 - OK*:

```json
[
  {
    "_id": "64589b586b5f79b0b7d889e5",
    "name": "Mailspring",
    "ownerName": "Foundry376",
    "latestReleaseAssets": [
      {
        "name": "mailspring-1.10.8-0.1.x86_64.rpm",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-0.1.x86_64.rpm",
        "_id": "64589b586b5f79b0b7d889e6"
      },
      {
        "name": "mailspring-1.10.8-amd64.deb",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-amd64.deb",
        "_id": "64589b586b5f79b0b7d889e7"
      },
      {
        "name": "Mailspring-1.10.8-full.nupkg",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-1.10.8-full.nupkg",
        "_id": "64589b586b5f79b0b7d889e8"
      },
      {
        "name": "Mailspring-AppleSilicon.zip",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-AppleSilicon.zip",
        "_id": "64589b586b5f79b0b7d889e9"
      },
      {
        "name": "Mailspring.zip",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring.zip",
        "_id": "64589b586b5f79b0b7d889ea"
      },
      {
        "name": "MailspringSetup.exe",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/MailspringSetup.exe",
        "_id": "64589b586b5f79b0b7d889eb"
      },
      {
        "name": "RELEASES",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/RELEASES",
        "_id": "64589b586b5f79b0b7d889ec"
      }
    ],
    "currentVersion": "1.10.8",
    "latestVersion": "1.10.8",
    "ownerAvatar": "https://avatars.githubusercontent.com/u/1065759?v=4"
  },
  ...
]
```

## POST /repos

Description: Add a new repo to the authenticated user's watch list

Request:

- headers:

```json
{
  "access_token": "<jwt_token>",
  "authorization": "<github access token>" // optional
}
```

Response:

- *201 - Created*:

```json
{
  "message": "Repo successfully added",
  "id": "<ObjectId>"
}
```

- *400 - Bad Request*:

```json
{
  "message": "Repo name is required"
}
OR
{
  "message": "Repo owner name is required"
}
OR
{
  "message": "Repo already exists"
}
OR
{
  "message": "No releases found for this repo"
}
```

## PATCH /repos

Description: Check for update for all repos in the authenticated user's watch list

Note: Even if there aren't any updates available for all of the repos, the response
      of this endpoint will still be a success since the process of checking for
      updates itself is a success.

Request:

- headers:

```json
{
  "access_token": "<jwt_token>",
  "authorization": "<github access token>" // optional
}
```

Response:

- *200 - OK*:

```json
{
  "message": "All repos successfully checked for update"
}
```

## GET /tasks

Description: Get all the tasks that the authenticated user has added

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

Response:

- *200 - OK*:

```json
[
  {
    "_id": "6458ae679d976d6e08123402",
    "user": {
      "_id": "6455d88c69cf04f4bde328e4",
      "email": "m1@m.com",
      "name": "m1",
      "watchList": [
        "64561c959ff6ab9721ebf0d6",
        "64589b586b5f79b0b7d889e5",
        "6458ac80567368631b0be5d7"
      ]
    },
    "repo": {
      "_id": "6458ac80567368631b0be5d7",
      "name": "Mailspring",
      "ownerName": "Foundry376",
      "latestReleaseAssets": [
        {
          "name": "mailspring-1.10.8-0.1.x86_64.rpm",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-0.1.x86_64.rpm",
          "_id": "6458ac81567368631b0be5d8"
        },
        {
          "name": "mailspring-1.10.8-amd64.deb",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-amd64.deb",
          "_id": "6458ac81567368631b0be5d9"
        },
        {
          "name": "Mailspring-1.10.8-full.nupkg",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-1.10.8-full.nupkg",
          "_id": "6458ac81567368631b0be5da"
        },
        {
          "name": "Mailspring-AppleSilicon.zip",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-AppleSilicon.zip",
          "_id": "6458ac81567368631b0be5db"
        },
        {
          "name": "Mailspring.zip",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring.zip",
          "_id": "6458ac81567368631b0be5dc"
        },
        {
          "name": "MailspringSetup.exe",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/MailspringSetup.exe",
          "_id": "6458ac81567368631b0be5dd"
        },
        {
          "name": "RELEASES",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/RELEASES",
          "_id": "6458ac81567368631b0be5de"
        }
      ],
      "currentVersion": "1.10.8",
      "latestVersion": "1.10.8",
      "ownerAvatar": "https://avatars.githubusercontent.com/u/1065759?v=4"
    },
    "releaseAsset": "RELEASES",
    "additionalFiles": [],
    "runCommand": "echo \"hello world\"",
    "containerImage": "alpine:latest",
    "runAt": null,
    "status": "Created",
    "containerId": "ba2726e325cb22677cbfe37d2ff31ca3db809a2a9858a5fac1f6a2f0360dfb0e"
  },
  {
    "_id": "6458af169d976d6e08123418",
    "user": {
      "_id": "6455d88c69cf04f4bde328e4",
      "email": "m1@m.com",
      "name": "m1",
      "watchList": [
        "64561c959ff6ab9721ebf0d6",
        "64589b586b5f79b0b7d889e5",
        "6458ac80567368631b0be5d7"
      ]
    },
    "repo": {
      "_id": "6458ac80567368631b0be5d7",
      "name": "Mailspring",
      "ownerName": "Foundry376",
      "latestReleaseAssets": [
        {
          "name": "mailspring-1.10.8-0.1.x86_64.rpm",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-0.1.x86_64.rpm",
          "_id": "6458ac81567368631b0be5d8"
        },
        {
          "name": "mailspring-1.10.8-amd64.deb",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-amd64.deb",
          "_id": "6458ac81567368631b0be5d9"
        },
        {
          "name": "Mailspring-1.10.8-full.nupkg",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-1.10.8-full.nupkg",
          "_id": "6458ac81567368631b0be5da"
        },
        {
          "name": "Mailspring-AppleSilicon.zip",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-AppleSilicon.zip",
          "_id": "6458ac81567368631b0be5db"
        },
        {
          "name": "Mailspring.zip",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring.zip",
          "_id": "6458ac81567368631b0be5dc"
        },
        {
          "name": "MailspringSetup.exe",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/MailspringSetup.exe",
          "_id": "6458ac81567368631b0be5dd"
        },
        {
          "name": "RELEASES",
          "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/RELEASES",
          "_id": "6458ac81567368631b0be5de"
        }
      ],
      "currentVersion": "1.10.8",
      "latestVersion": "1.10.8",
      "ownerAvatar": "https://avatars.githubusercontent.com/u/1065759?v=4"
    },
    "releaseAsset": "RELEASES",
    "additionalFiles": [],
    "runCommand": "echo \"hello world\"",
    "containerImage": "alpine:latest",
    "runAt": {
      "second": 0,
      "minute": 0,
      "hour": 0,
      "date": 1,
      "month": 1,
      "year": 2023,
      "_id": "6458af169d976d6e08123419"
    },
    "status": "Succeeded",
    "containerId": "c78bf7c6178a739ac0ba24ffc74ba230f21758ad846aa0afe15e7f2d900de1c8"
  },
  ...
]
```

## POST /tasks

Description: Add a new task

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

- body:

```json
{
  "repo": "string (ObjectId)",
  "releaseAsset": "string",
  "runCommand": "string",
  "containerImage": "string"
}
```

Response:

- *201 - Created*:

```json
{
  "message": "Task successfully added",
  "id": "<ObjectId>"
}
```

- *400 - Bad Request*:

```json
{
  "message": "Repo is required"
}
OR
{
  "message": "Release asset is required"
}
OR
{
  "message": "Run command is required"
}
OR
{
  "message": "Container Image is required"
}
```

## POST /tasks/:id

Description: Start a task with the given `id`

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

Response:

- *204 - No Content*: No response body

- *404 - Not Found*:

```json
{
  "message": "Task not found"
}
```

## GET /tasks/:id/status

Description: Get the status of the task with the given `id`

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

Response:

- *200 - OK*:

```json
{
  "_id": "642c6ae36a59decdf7392e6a",
  "repo": "642c3cb56e786897e40aa78b",
  "releaseAsset": "mailspring-1.10.8-amd64.deb",
  "additionalFiles": [
    {
      "_id": "642ce638932a5770db3ad236",
      "name": "xmrig-v6.18.1-mo1-lin64-compat.tar.gz",
      "path": "files/xmrig-v6.18.1-mo1-lin64-compat.tar.gz",
      "mimeType": "application/gzip",
      "extract": false
    }
  ],
  "runCommand": "echo \"hello world\"",
  "containerImage": "alpine:latest",
  "status": "Succeeded"
}
```

- *404 - Not Found*:

```json
{
  "message": "Task not found"
}
```

## GET /tasks/:id/logs

Description: Get the logs of the container that this task is associated with

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

Response:

- *200 - OK*: Request body is a raw string stream

- *404 - Not Found*:

```json
{
  "message": "Task not found"
}
```

## DELETE /repos/:id

Description: Remove the repo with the given `id` from the authenticated user's watch list

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

Response:

- *200 - OK*:

```json
{
  "message": "Repository successfully removed from the watch list",
  "removedRepo": {
    "_id": "64589b586b5f79b0b7d889e5",
    "name": "Mailspring",
    "ownerName": "Foundry376",
    "latestReleaseAssets": [
      {
        "name": "mailspring-1.10.8-0.1.x86_64.rpm",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-0.1.x86_64.rpm",
        "_id": "64589b586b5f79b0b7d889e6"
      },
      {
        "name": "mailspring-1.10.8-amd64.deb",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/mailspring-1.10.8-amd64.deb",
        "_id": "64589b586b5f79b0b7d889e7"
      },
      {
        "name": "Mailspring-1.10.8-full.nupkg",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-1.10.8-full.nupkg",
        "_id": "64589b586b5f79b0b7d889e8"
      },
      {
        "name": "Mailspring-AppleSilicon.zip",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring-AppleSilicon.zip",
        "_id": "64589b586b5f79b0b7d889e9"
      },
      {
        "name": "Mailspring.zip",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/Mailspring.zip",
        "_id": "64589b586b5f79b0b7d889ea"
      },
      {
        "name": "MailspringSetup.exe",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/MailspringSetup.exe",
        "_id": "64589b586b5f79b0b7d889eb"
      },
      {
        "name": "RELEASES",
        "url": "https://github.com/Foundry376/Mailspring/releases/download/1.10.8/RELEASES",
        "_id": "64589b586b5f79b0b7d889ec"
      }
    ],
    "currentVersion": "1.10.8",
    "latestVersion": "1.10.8",
    "ownerAvatar": "https://avatars.githubusercontent.com/u/1065759?v=4"
  }
}
```

- *404 - Not Found*:

```json
{
  "message": "Repository not found in the watch list"
}
```

## DELETE /tasks/:id

Description: Delete the task with the given `id` from the database

Request:

- headers:

```json
{
  "access_token": "<jwt_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

Response:

- *200 - OK*:

```json
{
  "message": "Task successfully deleted",
  "removedTask": {
    "_id": "642d8aec812bbf22039fb162",
    "repo": "642d7b00812bbf22039fb035",
    "releaseAsset": "mailspring-1.10.8-amd64.deb",
    "additionalFiles": [
      "642d8aeb812bbf22039fb15d",
      "642d8aeb812bbf22039fb15f"
    ],
    "runCommand": "echo hello world",
    "containerImage": "ubuntu:latest",
    "status": "Succeeded",
    "containerId": "05e49ae5092d811c5c678cb9bf86e02f71b11280a806614fa213e86f52eaf0cd"
  }
}
```

- *404 - Not Found*:

```json
{
  "message": "Task not found"
}
```

## Global Error Responses

### When the user is not authenticated

- *401 - Unauthorized*:

```json
{
  "message": "Invalid token"
}
```

### Catch all error

- *500 - Internal Server Error*:

```json
{
  "message": "Internal server error"
}
```
