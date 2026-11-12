import React from "react";

function checkStatus(response) {
  if(response.ok) {
    return response;
  }
  throw new Error('Request was either a 404 or 500');
}

const json = (response) => response.json()

const Movie = (props) => {
    const { Title, Year, imdbID, Type, Poster } = props.movie;

    return (
        <div className="row">
            <div className="col-4 col-md-3 mb-3">
                <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
                <h4>{Title}</h4>
                <p>{Type} | {Year}</p>
                </a>
            </div>    
        </div>
    )
}

export default class MovieFinder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      results: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim();
    if (!searchTerm) {
        return;
    }


    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=1e06a164`)
    .then(checkStatus)
    .then(json)
    .then((data) => {
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      this.setState({ results: data.Search });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { searchTerm, results } = this.state;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="frozen"
            value={searchTerm}
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>

        <p>Searching for: {searchTerm}</p>

        {results.map((movie) => {
          return <Movie key={movie.imdbID} movie={movie} />;
        })}
       </div>
    );
  }
}