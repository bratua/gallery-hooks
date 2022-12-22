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
  const [searchQuery, setSearchQuery] = useState('');
  const [pictures, setPictures] = useState([]);
  const [picturesCount, setPicturesCount] = useState(0);
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState('idle');
  const [imagesLeft, setImagesLeft] = useState(null);
  const [imagesInQuery, setImagesInQuery] = useState(null);
  const [scrollToId, setScrollToId] = useState(null);
  // const [statsQuery, setStatsQuery] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // componentDidMount() {
  //   this.setState({ searchQuery: '' });
  // }

  useEffect(() => {
    setSearchQuery('');
  }, []);

  useEffect(() => {
    getPictures();
    scrollNextPage();
    showStats();
  }, [page]);

  useEffect(() => {
    setPictures([]);
    setPage(1);
    getPictures();
    showStats();
  }, [searchQuery]);

  // async componentDidUpdate(prevProps, prevState) {
  //   // console.log('upp start');
  // if (this.state.page !== prevState.page) {
  //   await this.getPictures();
  //   await this.scrollNextPage();
  //   await this.showStats();

  //   // this.onLoad();
  // }
  // // console.log('upp end');

  // if (this.state.searchQuery !== prevState.searchQuery) {
  //   this.setState({ pictures: [], page: 1 });
  //   await this.getPictures();
  //   this.showStats();
  // }
  // }

  const onSearch = query => {
    if (query === searchQuery) {
      return;
    }
    setSearchQuery(query);
  };

  const onNext = () => {
    setPage(page => page + 1);
    setImagesLeft(imagesInQuery - page * IMAGES_PER_PAGE);

    // this.setState(prev => ({
    //   page: prev.page + 1,
    //   imagesLeft: prev.imagesInQuery - this.state.page * 12,
    // }));
  };

  const onLoad = () => {
    setTimeout(() => {
      if (picturesCount === 0) {
        setProgress('loaded');
      }
    }, 0);
  };

  const onLoadImgCheck = loadStatus => {
    // console.log(loadStatus);
    if (loadStatus) {
      setPicturesCount(count => count - 1);
      // this.setState(state => ({
      //   picturesCount: state.picturesCount - 1,
      // }));
      onLoad();
      return;
    }
  };

  async function getPictures(searchQuery, page) {
    // let { pictures, statsQuery } = this.state;
    let pictures = [];
    let statsQuery = null;
    try {
      setProgress('loading');
      const apiResponse = await API.getQueryPicture(searchQuery, page);

      pictures = apiResponse.hits;
      statsQuery = apiResponse.stats;

      if (pictures.length === 0) {
        // console.log('No images!');
        throw new Error(`${searchQuery} Картинок по зпросу не найдено!`);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setProgress('idle');

      toast.error(errorMessage, {
        position: 'top-right',
      });

      return;
    }

    setPictures(prevPictures => [...prevPictures, ...pictures]);
    setScrollToId(pictures[0].id);
    setPicturesCount(pictures.length);
    setImagesInQuery(statsQuery);
  }

  const showStats = async () => {
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

  const scrollNextPage = async () => {
    setTimeout(() => {
      const target = scrollToId;
      const targetItem = document.getElementById(`${target}`);
      targetItem.scrollIntoView();
    }, 0);
  };

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
// export class App extends PureComponent {
//   state = {
//     searchQuery: '',
//     pictures: [],
//     picturesCount: 0,
//     page: 1,
//     progress: 'idle',
//     imagesLeft: null,
//     imagesInQuery: null,
//     scrollToId: null,
//     statsQuery: null,
//   };

// componentDidMount() {
//   this.setState({ searchQuery: '' });
// }

// async componentDidUpdate(prevProps, prevState) {
//   // console.log('upp start');
//   if (this.state.page !== prevState.page) {
//     await this.getPictures();
//     await this.scrollNextPage();
//     await this.showStats();

//     // this.onLoad();
//   }
//   // console.log('upp end');

//   if (this.state.searchQuery !== prevState.searchQuery) {
//     this.setState({ pictures: [], page: 1 });
//     await this.getPictures();
//     this.showStats();
//   }
// }

// onSearch = query => {
//   if (query === this.state.searchQuery) {
//     return;
//   }
//   this.setState({ searchQuery: query });
// };

// onNext = () => {
//   this.setState(prev => ({
//     page: prev.page + 1,
//     imagesLeft: prev.imagesInQuery - this.state.page * 12,
//   }));
// };

// onLoad = () => {
//   setTimeout(() => {
//     if (this.state.picturesCount === 0) {
//       this.setState({ progress: 'loaded' });
//     }
//   }, 0);
// };

// onLoadImgCheck = loadStatus => {
//   // console.log(loadStatus);
//   if (loadStatus) {
//     this.setState(state => ({
//       picturesCount: state.picturesCount - 1,
//     }));
//     this.onLoad();
//     return;
//   }
// };

// getPictures = async () => {
//   // let { pictures, statsQuery } = this.state;
//   let pictures = [];
//   let statsQuery = null;
//   try {
//     this.setState({ progress: 'loading' });
//     const apiResponse = await API.getQueryPicture(
//       this.state.searchQuery,
//       this.state.page
//     );
//     pictures = apiResponse.hits;
//     statsQuery = apiResponse.stats;

//     if (pictures.length === 0) {
//       // console.log('No images!');
//       throw new Error(
//         `${this.props.searchQuery} Картинок по зпросу не найдено!`
//       );
//     }
//   } catch (error) {
//     // console.log('catch ', error.message);
//     toast.error(error.message, {
//       position: 'top-right',
//     });

//     this.setState({
//       errorMessage: error.message,
//       progress: 'idle',
//     });
//     return;
//   }
//   console.log('pictures', pictures);
//   console.log('statsQuery', statsQuery);

//   this.setState(prevState => ({
//     pictures: [...prevState.pictures, ...pictures],
//     scrollToId: pictures[0].id,
//     picturesCount: pictures.length,
//     imagesInQuery: statsQuery,
//   }));
// };

// showStats = async () => {
//   setTimeout(() => {
//     let totalPages = Math.ceil(this.state.imagesInQuery / 12);
//     let pagesLeft = totalPages - this.state.page;

//     if (this.state.pictures.length > 0) {
//       toast.success(
//         `Найдено:
//         изображений: ${this.state.imagesInQuery};
//         страниц: ${totalPages};
//         страниц осталось: ${pagesLeft};
//         вы на: ${this.state.page} странице;`,
//         {
//           position: 'top-right',
//         }
//       );
//     }
//   }, 0);
// };

// scrollNextPage = async () => {
//   setTimeout(() => {
//     const target = this.state.scrollToId;
//     const targetItem = document.getElementById(`${target}`);
//     targetItem.scrollIntoView();
//   }, 0);
// };

//   render() {
// return (
//   <Box className="App">
//     <SearchBar onSubmit={this.onSearch} />

//     <ImageGallery
//       pictures={this.state.pictures}
//       onLoadImg={this.onLoadImgCheck}
//     />

//     <ToastContainer
//       position="top-right"
//       autoClose={5000}
//       hideProgressBar={false}
//       newestOnTop={false}
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//       theme="dark"
//     />

//     {this.state.progress === 'loaded' && (
//       <Button
//         type="button"
//         className="Button"
//         disabled={
//           this.state.pictures.length < 12 ||
//           this.state.pictures.length % 12 !== 0
//         }
//         onClick={this.onNext}
//       >
//         Next
//       </Button>
//     )}
//   </Box>
// );
//   }
// }
