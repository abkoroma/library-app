import { Fragment } from "react";
import Carousel from "./components/Carousel";
import ExploreTopBooks from "./components/ExploreTopBooks";
import Heroes from "./components/Heroes";
import LibraryServices from "./components/LibraryServices";

export default function HomePage() {
    return (
        <Fragment>
            <ExploreTopBooks />
            <Carousel />
            <Heroes />
            <LibraryServices />
        </Fragment>
    );
}