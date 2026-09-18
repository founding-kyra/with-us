import "./TextBlock.css";

import Copy from "../Copy/Copy";
import BrandIcon from "../BrandIcon/BrandIcon";

const TextBlock = () => {
  return (
    <section className="text-block">
      <div className="text-block-bg-img">
        <img src="/Photos 2/WUS-33.webp" alt="WITHUS Background" />
      </div>
      <div className="container">
        <div className="text-block-col">
          <Copy>
            <h3>
              WITHUS creates garments built around textures, silhouettes, and mobility.
            </h3>
          </Copy>
          <div className="text-block-logo">
            <BrandIcon />
          </div>
        </div>
        <div className="text-block-col">
          <div className="text-block-copy">
            <Copy>
              {/* Placeholder removed */}
            </Copy>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TextBlock;
