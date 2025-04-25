import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllStates } from '@/lib/actions/location.actions';
import { SearchIcon } from 'lucide-react';

const Search = async () => {
  const states = await getAllStates();

  return (
    <form action="/search-rides" method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <span id="state-label" className="sr-only">
          State
        </span>
        <Select>
          <SelectTrigger aria-labelledby="state-label" className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="max-h-[400px]">
            <SelectGroup>
              <SelectLabel>States</SelectLabel>
              <SelectItem key="All" value="all">
                All
              </SelectItem>
              {states.map((x) => (
                <SelectItem key={x.abbreviation} value={x.abbreviation}>
                  {x.abbreviation}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <label htmlFor="q" className="sr-only">
          Query
        </label>
        <Input
          id="q"
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[300px]"
        />
        <Button>
          <SearchIcon />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
};

export default Search;
