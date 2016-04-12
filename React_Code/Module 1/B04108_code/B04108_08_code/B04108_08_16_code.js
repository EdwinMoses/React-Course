      else {
        workbench = [];
        workbench = workbench.concat(initial_tokens);
        for(var index = 0; index < Math.floor((new
          Date().getTime() - that.state.start_time) /
          that.props.interval) - initial_tokens.length; index +=
          1) {
          var position = index % repeated_tokens.length;
          workbench = workbench.concat(
            repeated_tokens.slice(position, position + 1));
          }
        }
