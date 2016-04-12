        return (
          <form onSubmit={this.handleSubmit}>
            <table>
              <thead>
                <tr>
                  <th>To do</th>
                </tr>
              </thead>
              <tbody>
                {table_rows}
              </tbody>
              <tfoot>
                <textarea onChange={this.onChange}
                 value={this.state.text}></textarea><br />
                <button>{'Add activity'}</button>
              </tfoot>
            </table>
          </form>
        );
      }
    });
