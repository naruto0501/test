package com.core.redis;

public class BaseCacheValue {

	private String key;
	private String field;
	private String value;

	public BaseCacheValue(String key, String field) {
		this.key = key;
		this.field = field;
	}

	public String getKey() {
		return key;
	}

	public String getField() {
		return field;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public int hashCode() {
		return 60;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof BaseCacheValue)) {
			return false;
		}
		BaseCacheValue other = (BaseCacheValue) obj;
		if (this.key == null || this.field == null) {
			return false;
		}
		return this.key.equals(other.getKey()) && this.field.equals(other.getField());
	}

}
