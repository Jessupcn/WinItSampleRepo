import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Input, Form } from 'semantic-ui-react';
import { fetchSummoner } from '../redux_store';
import history from '../history';

class SearchSummoner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      input: event.target.value
    });
  }

  handleSubmit() {
    this.props
      .loadSummoner(this.state.input)
      .then(history.push(`/summoner/${this.state.input}`))
      .catch();

    this.setState({
      input: ''
    });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input
          icon={
            <Icon
              name="search"
              inverted
              circular
              link
              onClick={this.handleSubmit}
            />
          }
          placeholder="Search Summoner..."
          onChange={this.handleChange}
          value={this.state.input}
        />
      </Form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadSummoner: summonerName => {
    const action = fetchSummoner(summonerName);
    return dispatch(action);
  }
});

export default connect(
  null,
  mapDispatchToProps
)(SearchSummoner);
