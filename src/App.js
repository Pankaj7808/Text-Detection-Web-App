import "./App.css";
import ImageTextDetector from "./Components/ImageText";
import ImageUploader from "./Components/ImageUploader";
import Navbar from "./Components/Navbar";
import TextDetectionComponent from "./Components/Simple";
import UrlUploader from "./Components/UrlUploader";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <ImageUploader/>
    </div>
  );
}

export default App;
