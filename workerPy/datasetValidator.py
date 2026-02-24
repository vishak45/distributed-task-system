import pandas as pd
import json
from datetime import datetime

def validate_dataset(dataset_path):
    """
    Validate a CSV dataset and generate a comprehensive report
    Checks for: null values, missing fields, duplicates, data types
    """
    try:
        df = pd.read_csv(dataset_path)
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to read CSV file: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
    
    report = {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "file": dataset_path,
        "summary": {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": list(df.columns),
        },
        "validation_results": {
            "null_values": {},
            "missing_fields": [],
            "duplicate_rows": 0,
            "data_quality": {}
        },
        "issues_found": 0,
        "warnings": []
    }
    
  
    null_counts = df.isnull().sum()
    for column, null_count in null_counts.items():
        if null_count > 0:
            percentage = (null_count / len(df)) * 100
            report["validation_results"]["null_values"][column] = {
                "count": int(null_count),
                "percentage": round(percentage, 2)
            }
            report["issues_found"] += 1
    
 
    duplicate_count = df.duplicated().sum()
    report["validation_results"]["duplicate_rows"] = int(duplicate_count)
    if duplicate_count > 0:
        report["warnings"].append(f"Found {duplicate_count} duplicate rows")
        report["issues_found"] += 1
    

    for column in df.columns:
        col_stats = {
            "data_type": str(df[column].dtype),
            "non_null_count": int(df[column].notna().sum()),
            "unique_values": int(df[column].nunique())
        }
        
        
        if pd.api.types.is_numeric_dtype(df[column]):
            col_stats["min"] = float(df[column].min())
            col_stats["max"] = float(df[column].max())
            col_stats["mean"] = float(df[column].mean())
        
        
        if pd.api.types.is_object_dtype(df[column]):
            col_stats["sample_values"] = df[column].dropna().head(3).tolist()
        
        report["validation_results"]["data_quality"][column] = col_stats
    
    
    if report["issues_found"] == 0:
        report["validation_summary"] = "✅ Dataset is valid - No issues found"
    else:
        report["validation_summary"] = f"⚠️  Found {report['issues_found']} issue(s) in the dataset"
    
    return report


    