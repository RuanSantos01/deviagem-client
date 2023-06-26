import StarIcon from '@mui/icons-material/Star';

function StarRating({ rating }) {
    const stars = Array.from({ length: rating }, (_, index) => (
        <StarIcon key={index} sx={{ color: "gold", fontSize: '25px' }} />
    ));

    return <div>{stars}</div>;
}

export default StarRating;