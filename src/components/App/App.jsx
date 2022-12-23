import Box from 'components/Box';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import * as API from 'API_Pixabay/API_Pixabay';
import 'react-toastify/dist/ReactToastify.css';
import { SearchBar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Button } from 'components/Button';

const IMAGES_PER_PAGE = 12;

const App = () => {
  const [pictures, setPictures] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [picturesCount, setPicturesCount] = useState(0);
  const [progress, setProgress] = useState('idle');
  const [imagesLeft, setImagesLeft] = useState(null);
  const [imagesInQuery, setImagesInQuery] = useState(null);
  const [scrollToId, setScrollToId] = useState(null);

  const onSearch = query => {
    if (query === searchQuery) {
      return;
    }
    setPage(1);
    setSearchQuery(query);
    setImagesLeft(imagesInQuery);
    // showStats();
  };

  const onNext = () => {
    setPage(page => page + 1);
    setImagesLeft(imagesInQuery - page * IMAGES_PER_PAGE);
  };

  const onLoadImgCheck = loadStatus => {
    if (loadStatus && picturesCount > 0) {
      setPicturesCount(count => count - 1);
      return;
    }
  };

  async function getPictures(searchQuery, page) {
    let pictures = [];
    let statsQuery = null;

    try {
      setProgress('loading');

      const apiResponse = await API.getQueryPicture(
        searchQuery,
        page,
        IMAGES_PER_PAGE
      );

      pictures = apiResponse.hits;
      statsQuery = apiResponse.stats;

      if (pictures.length === 0) {
        throw new Error(`${searchQuery} Картинок по зпросу не найдено!`);
      }
    } catch (error) {
      setProgress('idle');

      toast.error(error.message, {
        position: 'top-right',
      });

      return;
    }
    setPicturesCount(pictures.length);
    setPictures(prevPictures => [...prevPictures, ...pictures]);
    setScrollToId(pictures[0].id);
    setImagesInQuery(statsQuery);

    // console.log('get picture end');
  }

  const showStats = () => {
    setTimeout(() => {
      let totalPages = Math.ceil(imagesInQuery / IMAGES_PER_PAGE);
      let pagesLeft = totalPages - page;

      if (pictures.length > 0) {
        toast.success(
          `Найдено:
          изображений: ${imagesInQuery};
          страниц: ${totalPages};
          страниц осталось: ${pagesLeft};
          вы на: ${page} странице;`,
          {
            position: 'top-right',
          }
        );
      }
    }, 0);
  };

  const scrollNextPage = targetId => {
    setTimeout(() => {
      const targetItem = document.getElementById(`${targetId}`);
      targetItem.scrollIntoView();
    }, 0);
  };

  useEffect(() => {
    setPage(1);
    setPictures([]);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    getPictures(searchQuery, page);
  }, [page, searchQuery]);

  useEffect(() => {
    if (picturesCount === 0) {
      setProgress('loaded');
    }
  }, [picturesCount]);

  useEffect(() => {
    if (scrollToId) {
      scrollNextPage(scrollToId);
    }
  }, [scrollToId]);

  useEffect(() => {
    showStats();
  }, [imagesLeft, imagesInQuery]);

  return (
    <Box className="App">
      <SearchBar onSubmit={onSearch} />

      <ImageGallery pictures={pictures} onLoadImg={onLoadImgCheck} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {progress === 'loaded' && (
        <Button
          type="button"
          className="Button"
          disabled={
            pictures.length < IMAGES_PER_PAGE ||
            pictures.length % IMAGES_PER_PAGE !== 0
          }
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </Box>
  );
};

export { App };
