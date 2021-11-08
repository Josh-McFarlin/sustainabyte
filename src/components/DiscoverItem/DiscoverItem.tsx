import * as React from "react";
import { useQuery } from "react-query";
import { fetchUser } from "../../actions/user";
import { fetchRestaurant } from "../../actions/restaurant";
import type { UserType } from "../../types/User";
import { RestaurantType } from "../../types/Restaurant";
import { RecentType } from "../../types/Recent";
import DiscoverCheckIn from "./CheckIn";
import DiscoverPost from "./Post";
import DiscoverReview from "./Review";
import { PostType } from "../../types/Post";
import { ReviewType } from "../../types/Review";
import { CheckInType } from "../../types/CheckIn";

type PropTypes = {
  item: RecentType;
};

const DiscoverItem: React.FC<PropTypes> = ({ item }) => {
  const { type, data } = item;
  const { user: userId, restaurant: restaurantId } = data || {};
  const { data: user } = useQuery<UserType, Error>(
    ["user", userId],
    fetchUser,
    {
      enabled: userId != null,
    }
  );
  const { data: restaurant } = useQuery<RestaurantType, Error>(
    ["restaurant", restaurantId],
    fetchRestaurant,
    {
      enabled: restaurantId != null,
    }
  );

  if (type === "Post") {
    return (
      <DiscoverPost
        data={data as PostType}
        user={user}
        restaurant={restaurant}
      />
    );
  }
  if (type === "Review") {
    return (
      <DiscoverReview
        data={data as ReviewType}
        user={user}
        restaurant={restaurant}
      />
    );
  }
  if (type === "CheckIn") {
    return (
      <DiscoverCheckIn
        data={data as CheckInType}
        user={user}
        restaurant={restaurant}
      />
    );
  }
  return null;
};

export default DiscoverItem;
