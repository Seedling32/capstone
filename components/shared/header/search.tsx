import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllDifficulties } from '@/lib/actions/ride.actions';
import { SearchIcon } from 'lucide-react';

const Search = async () => {
  const difficulties = await getAllDifficulties();

  return (
    <form action="/search-rides" method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select name="difficulty">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value="all">
              All
            </SelectItem>
            {difficulties.map((x) => (
              <SelectItem
                key={
                  x.difficulty.charAt(0).toUpperCase() + x.difficulty.slice(1)
                }
                value={x.difficulty}
              >
                {x.difficulty.charAt(0).toUpperCase() + x.difficulty.slice(1)}
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
