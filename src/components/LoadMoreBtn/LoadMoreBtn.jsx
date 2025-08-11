import css from "./LoadMoreBtn.module.css";

const LoadMoreBtn = ({ handleLoadMore }) => {
  return (
    <div className={css.loadMoreBtn_box}>
      <button className={css.loadMoreButton} onClick={handleLoadMore}>
        Більше
      </button>
    </div>
  );
};

export default LoadMoreBtn;