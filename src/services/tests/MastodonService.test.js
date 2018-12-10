import {
  getFollowing,
  getFollowers,
  getStatuses,
  getFavourites,
  getStatusFavourites,
  getStatusReblogged,
  getStatusesWithDetails,
  getUserInfo,
} from '../MastodonService';
import { MASTODON } from '../../config';

describe('Mastodon Service Tests', () => {
  it('should get mastodon followings', async () => {
    const followings = await getFollowing('1');

    expect(followings.length).toBeTruthy();
  });

  it('should get mastodon followers', async () => {
    const followers = await getFollowers('1');

    expect(followers.length).toBeTruthy();
  });

  it('should get mastodon statuses', async () => {
    const statuses = await getStatuses('1');

    expect(statuses.length).toBeTruthy();
  });

  it('should get user favourites', async () => {
    const favourites = await getFavourites(MASTODON.ACCESS_TOKEN);

    expect(favourites.length).toBeTruthy();
  });

  it('should get mastodon favourites for status', async () => {
    const statusId = '101182544670087501';
    const favourites = await getStatusFavourites(statusId);

    expect(favourites.length).toBeTruthy();
  });

  it('should get mastodon reblogged for status', async () => {
    const statusId = '101182544670087501';
    const reblogged = await getStatusReblogged(statusId);

    expect(reblogged.length).toBeTruthy();
  });

  it('should get statuses with details', async () => {
    const statusesWithDetails = await getStatusesWithDetails('1');

    expect(statusesWithDetails.length).toBeTruthy();
    expect(statusesWithDetails[0].reblogged_users).toBeTruthy();
    expect(statusesWithDetails[0].favourites_users).toBeTruthy();
  });

  it('should get user info', async () => {
    const userInfo = await getUserInfo('2');
    console.info(userInfo);

    expect(userInfo.username).toBeTruthy();
  });
});
