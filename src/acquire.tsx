import React from 'react';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { IApplicationState } from './store';
import { submitPlan } from './planactions';
import { clearQueue } from './planactions';
import { IPlanObject } from './queueserver';
import {
    RouteComponentProps
} from "react-router-dom";

type RouteParams = { id: string, uid: string };

interface Props extends RouteComponentProps<RouteParams> { }

interface IProps extends RouteComponentProps {
    submitPlan: typeof submitPlan;
    clearQueue: typeof clearQueue;
    loading: boolean;
    plan: IPlanObject;
}

interface IState {
    planId: number;
    onPlanChange: (planId: number) => void;
}

class AcquirePage extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state = {
          planId: -1,
          onPlanChange: this.handlePlanChange
        };
      }
    render() {
        return (
          <Container maxWidth="sm">
          <Box my={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              This is where we will acquire data...
              <Tooltip title="Clear the queue of the queueserver">
                <button onClick={this.handleClearQueue}>Clear Queue</button>
              </Tooltip>
            </Typography>
              <Typography variant="h6" component="h1" gutterBottom>
              <div>
                  loading: {this.props.loading}.
              </div>
            </Typography>
            <FormControl>
                <InputLabel id="demo-simple-select-label">type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.planId}
                    onChange={this.handleChange}
                >
                    <MenuItem value={0}>count</MenuItem>
                    <MenuItem value={1}>scan</MenuItem>
                </Select>
            </FormControl>
            <Tooltip title="Submit the plan to the queue">
              <Button variant="contained" onClick={this.handleSubmitClick}>Submit</Button>
            </Tooltip>
            <div><pre>The pretty printed JSON:<br />
                { JSON.stringify(this.props.plan, null, 2) }</pre></div>
          </Box>
        </Container>
        )
    }

    private handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        this.state.onPlanChange(event.target.value as number);
    };

    private handlePlanChange = (planId: number) => {
        this.setState({ planId });
    };

    private handleSubmitClick = () => {
        this.props.submitPlan(this.state.planId);
    }

    private handleClearQueue = () => {
        this.props.clearQueue();
    }
    componentDidMount() {
        //this.props.submitPlan();
    }
}

const mapStateToProps = (store: IApplicationState) => {
    return {
      loading: store.submitted.planLoading,
      plan: store.submitted.plan,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
      submitPlan: (planId: number) => dispatch(submitPlan(planId)),
      clearQueue: () => dispatch(clearQueue()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AcquirePage);
