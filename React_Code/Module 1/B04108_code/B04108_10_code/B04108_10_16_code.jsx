      result.push(<li>Ends on (optional): <input type="checkbox"
        name="series_ends" id="series_ends" /><ul><li>Month:
        <select id="end_month" name="end_month"
        defaultValue={month}>{months}</select></li>
        <li>End date:<select id="end_date"
        name="end_date" defaultValue={entry.date}
        >{dates}</select></li>
        <li>End year:<select id="end_year"
        name="end_year" defaultValue={entry.end_year + 1}
        >{years}</select></li></ul></li>);
      return <ul>{result}</ul>;
    },
