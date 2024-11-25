<script lang="ts" generics="T">
	import Fuse, {type FuseResult, type IFuseOptions} from 'fuse.js';

	export let list: ReadonlyArray<T>;
	export let options: IFuseOptions<T>;
	export let query : string;
    export let limit : number | undefined = undefined;

    export let autosearch : boolean = false;

	export let result: FuseResult<T>[];

	$: fuse = new Fuse(list, options);
	$: if (list) {
		fuse.setCollection(list);
	}

	$: if (autosearch && (list || query)) { search(); }

    export function search() {
        if (limit) {
            result = fuse.search(query, { limit });
        }
        else {
            result = fuse.search(query);
        }

        return result;
    }
</script>

<slot {search} />