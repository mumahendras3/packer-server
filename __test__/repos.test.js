const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });
const { it, expect, describe, beforeAll, afterAll } = require('@jest/globals');
const request = require('supertest');
const mongoose = require('../config/connection');
const User = require('../models/user');
const Repo = require('../models/repo');
const app = require('../app');
const { signToken } = require('../helpers/jwt');
const { default: axios } = require('axios');

// Initial data
const user2 = {
  email: 'm2@m.com',
  name: 'm2',
  password: '1234'
}
const repo1 = {
  name: 'repo1',
  ownerName: 'ownerRepo1'
};

// For storing access token
let access_token;

// Mock the axios module
jest.mock('axios');

// The mock responses for when hitting GitHub APIs
// When getting the latest version
const mockRespGetVersion = {
  data: {
    name: 'v1.0',
    assets: [{
      name: 'asset1',
      browser_download_url: 'asset1-download-url'
    }]
  }
};
// When getting the repo owner's avatar url
const mockRespGetAvatarUrl = {
  data: {
    avatar_url: 'https://picsum.photos/200'
  }
};
// When trying to add a repo with no releases
const mockRespNotFound = {
  response: {
    status: 404,
    data: {
      message: 'Not Found'
    }
  }
}
// When trying to check for an update for a repo in the database
const mockRespUpdate = {
  data: {
    name: 'v1.1' // Simulating update from v1.0 to v1.1
  }
};
// Register these mock responses (these order of invocation corresponds
// with the order of axios request that will be executed at test time)
axios.mockResolvedValueOnce(mockRespGetVersion);
axios.mockResolvedValueOnce(mockRespGetAvatarUrl);
axios.mockRejectedValueOnce(mockRespNotFound);
axios.mockResolvedValueOnce(mockRespUpdate);

beforeAll(async () => {
  // Insert the temporary user
  const user = new User(user2);
  await user.save();
  // Create the access token
  const payload = { id: user._id };
  access_token = signToken(payload);
});

afterAll(async () => {
  // Cleanup the database after test
  await User.findOneAndDelete({ email: user2.email, name: user2.name });
  await Repo.findOneAndDelete({ name: repo1.name, ownerName: repo1.ownerName });
  await mongoose.connection.close();
});

describe('POST /repos', () => {
  it(`should respond with the error message "Invalid token"`, async () => {
    const res = await request(app)
      .post('/repos')
      .send(repo1);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it(`should respond with the message "Repo successfully added" and should return the ObjectId of the newly added repo`, async () => {
    const res = await request(app)
      .post('/repos')
      .set('access_token', access_token)
      .send(repo1);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Repo successfully added');
    // Compare the returned id with the actual one in database
    const repo = await Repo.findOne({ name: repo1.name, ownerName: repo1.ownerName });
    expect(res.body).toHaveProperty('id', repo._id.toString());
  });

  it(`should respond with the error message "Repo name is required"`, async () => {
    const res = await request(app)
      .post('/repos')
      .set('access_token', access_token)
      .send({ ownerName: repo1.ownerName });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Repo name is required');
  });

  it(`should respond with the error message "Repo owner name is required"`, async () => {
    const res = await request(app)
      .post('/repos')
      .set('access_token', access_token)
      .send({ name: repo1.name });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Repo owner name is required');
  });

  it(`should respond with the error message "Repo already exists"`, async () => {
    const res = await request(app)
      .post('/repos')
      .set('access_token', access_token)
      .send(repo1);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Repo already exists');
  });

  it('should respond with the error message "No releases found for this repo"', async () => {
    const res = await request(app)
      .post('/repos')
      .set('access_token', access_token)
      .send({ name: 'a', ownerName: 'b' })
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'No releases found for this repo');
  });
});

describe('GET /repos', () => {
  it(`should respond with the error message "Invalid token"`, async () => {
    const res = await request(app)
      .get('/repos');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it(`should respond with the list of repos in the logged-in user's watchlist`, async () => {
    const res = await request(app)
      .get('/repos')
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name', repo1.name);
    expect(res.body[0]).toHaveProperty('ownerName', repo1.ownerName);
    expect(res.body[0]).toHaveProperty('currentVersion', mockRespGetVersion.data.name);
    expect(res.body[0]).toHaveProperty('latestVersion', mockRespGetVersion.data.name);
    expect(res.body[0]).toHaveProperty('ownerAvatar', mockRespGetAvatarUrl.data.avatar_url);
    expect(res.body[0]).toHaveProperty('latestReleaseAssets');
    expect(Array.isArray(res.body[0].latestReleaseAssets)).toBe(true);
    expect(res.body[0].latestReleaseAssets[0].name).toBe(mockRespGetVersion.data.assets[0].name);
    expect(res.body[0].latestReleaseAssets[0].url).toBe(mockRespGetVersion.data.assets[0].browser_download_url);
  });
});

describe('PATCH /repos', () => {
  it(`should respond with the error message "Invalid token"`, async () => {
    const res = await request(app)
      .patch('/repos');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it(`should respond with the message "All repos successfully checked for update" when no axios error thrown`, async () => {
    const res = await request(app)
      .patch('/repos')
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'All repos successfully checked for update');
    // Make sure the version in the database is also updated (v1.0 -> v1.1)
    const repo = await Repo.findOne(repo1);
    expect(repo).toHaveProperty('latestVersion', 'v1.1');
  });
});

describe('DELETE /repos/:id', () => {
  it(`should respond with the error message "Invalid token"`, async () => {
    // Get the soon-to-be-deleted repo first
    const repo = await Repo.findOne(repo1);
    const res = await request(app)
      .delete(`/repos/${repo._id.toString()}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it(`should respond with the error message "Repository not found in the watch list"`, async () => {
    const res = await request(app)
      .delete('/repos/64592d510230d28aef332764') // this is a valid, random ObjectId
      .set('access_token', access_token);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Repository not found in the watch list');
  });

  it(`should respond with the message "Repository successfully removed from the watch list" along with the removed repo's data`, async () => {
    // Get the soon-to-be-deleted repo first
    const repo = await Repo.findOne(repo1);
    const res = await request(app)
      .delete(`/repos/${repo._id.toString()}`)
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Repository successfully removed from the watch list');
    expect(res.body).toHaveProperty('removedRepo');
    expect(res.body.removedRepo).toHaveProperty('name', repo1.name);
    expect(res.body.removedRepo).toHaveProperty('ownerName', repo1.ownerName);
    expect(res.body.removedRepo).toHaveProperty('_id', repo._id.toString());
  });
});