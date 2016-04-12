      handleSubmit: function(event) {
        event.preventDefault();
        var new_item = get_todo_item();
        new_item.description = this.state.text;
        this.state.items.push(new_item);
        var next_text = '';
        this.setState({text: next_text});
        },
