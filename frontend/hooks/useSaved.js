// hooks/useSaved.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedListings, saveListingItem, removeSavedListing } from '../features/saved/savedSlice';

const useSaved = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.saved);

  useEffect(() => {
    dispatch(fetchSavedListings());
  }, [dispatch]);

  const saveListing = (listing) => {
    return dispatch(saveListingItem(listing)).unwrap();
  };

  const removeListing = (listingId) => {
    return dispatch(removeSavedListing(listingId)).unwrap();
  };

  const isListingSaved = (listingId) => {
    return items.some((item) => item.id === listingId);
  };

  return {
    savedListings: items,
    isLoading: loading,
    error,
    saveListing,
    removeListing,
    isListingSaved,
  };
};

export default useSaved;