import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
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
        <Select name="state">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value="all">
              All
            </SelectItem>
            {states.map((x) => (
              <SelectItem key={x.abbreviation} value={x.abbreviation}>
                {x.abbreviation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[300px]"
        />
        <Button>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
