import * as React from "react";
import { view } from "@risingstack/react-easy-state";
import { RecentType } from "../../types/Recent";
import DiscoverCheckIn from "./CheckIn";
import DiscoverPost from "./Post";
import DiscoverReview from "./Review";
import { PostType } from "../../types/Post";
import { ReviewType } from "../../types/Review";
import { CheckInType } from "../../types/CheckIn";
import restaurantsStore from "../../utils/restaurantData";
import usersStore from "../../utils/userData";
import { UserType } from "../../types/User";
import { RestaurantType } from "../../types/Restaurant";

type PropTypes = {
  item: RecentType;
};

const DiscoverItem: React.FC<PropTypes> = ({ item }) => {
  const { type, data } = item;
  const { user: userId, restaurant: restaurantId } = data || {};
  const user = userId != null ? (usersStore.getFull(userId) as UserType) : null;
  const restaurant =
    restaurantId != null
      ? (restaurantsStore.getFull(restaurantId) as RestaurantType)
      : null;

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

export default view(DiscoverItem);
