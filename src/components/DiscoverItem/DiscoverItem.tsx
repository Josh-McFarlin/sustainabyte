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
import { useAuth } from "../../utils/auth";

type PropTypes = {
  item: RecentType;
};

const DiscoverItem: React.FC<PropTypes> = ({ item }) => {
  const { type, data } = item;
  const { user: userId, restaurant: restaurantId } = data || {};
  const { user: authedUser } = useAuth();
  const user = userId != null ? usersStore.get(userId) : null;
  const restaurant =
    restaurantId != null ? restaurantsStore.get(restaurantId) : null;

  const follows =
    authedUser._id === user._id ||
    usersStore?.following?.has(userId || restaurantId) ||
    false;
  const saved = usersStore?.saved?.has(data._id) || false;

  if (type === "Post") {
    return (
      <DiscoverPost
        data={data as PostType}
        user={user}
        restaurant={restaurant}
        follows={follows}
        saved={saved}
      />
    );
  }
  if (type === "Review") {
    return (
      <DiscoverReview
        data={data as ReviewType}
        user={user}
        restaurant={restaurant}
        follows={follows}
        saved={saved}
      />
    );
  }
  if (type === "CheckIn") {
    return (
      <DiscoverCheckIn
        data={data as CheckInType}
        user={user}
        restaurant={restaurant}
        saved={saved}
      />
    );
  }
  return null;
};

export default view(DiscoverItem);
