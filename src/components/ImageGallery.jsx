import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ImageGallery = (props) => {
    const { images } = props;

    return (

        <ReactImageGallery
            items={images}
            thumbnailPosition='left'
            showIndex={true}
            showThumbnails={false}
            slideOnThumbnailOver={true}
            thumbnailHeight={150}
            showPlayButton={false}
            showBullets={true}
            showFullscreenButton={false}
            showNav={true}
            renderItem={(item) => (
                <div>
                    <img src={`https://deviagem-server.onrender.com/assets/${item}`} alt={`https://deviagem-server.onrender.com/assets/${item}`} />
                </div>
            )}
        />

    )
}

export default ImageGallery