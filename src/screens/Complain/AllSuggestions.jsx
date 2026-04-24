import React from 'react';
import AllComplaints from './AllComplaints';

export default function AllSuggestions({ route, navigation }) {
  const mergedRoute = {
    ...route,
    params: {
      ...route?.params,
      isSuggestion: true,
    },
  };

  return <AllComplaints route={mergedRoute} navigation={navigation} />;
}
