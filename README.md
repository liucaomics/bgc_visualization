## Usage

`visualize_bgc.py` helps draw a biosynthetic gene cluster (BGC) given the genes positions. It takes a BGC table and an output file name as inputs.

Each row of the BGC table is a gene. The BGC table should contain two columns `start` and `end`, which specify the start position and end position of each gene (e.g. `peptide_new.csv`). The output file could be a `.svg` file (e.g. `bgc.svg`).

An example command is as follows,

```
python visualize_bgc.py peptide_new.csv bgc.svg
```

## requirement
`plotly`, `pandas`, `numpy`

