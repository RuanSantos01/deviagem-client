import { useMediaQuery } from '@material-ui/core';
import Carousel from 'react-elastic-carousel';

const ImageGalleryElastic = (props) => {
    const { images } = props;
    const isNonMobile = useMediaQuery('(min-width: 650px)')

    return (
        <>

            {isNonMobile ? (
                <Carousel style={{ height: '50vh', backgroundColor: '#E6ECF5' }}>
                    {images.map((item, index) => <div key={index}>
                        <img
                            src={`http://localhost:3001/assets/${item}`}
                            alt={`http://localhost:3001/assets/${item}`}
                        />
                    </div>)}
                </Carousel>

            ) : (
                <>
                    {
                        images.map((item, index) => <div key={index}>
                            <img
                                style={{
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    width: '100%',
                                    height: '300px',
                                }}
                                src={`http://localhost:3001/assets/${item}`}
                                alt={`http://localhost:3001/assets/${item}`}
                            />
                        </div>)
                    }
                </>
            )}
        </>

    )
}

export default ImageGalleryElastic